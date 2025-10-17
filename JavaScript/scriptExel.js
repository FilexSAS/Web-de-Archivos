/**
 * @file scriptExel.js
 * @description Funcionalidad para cargar, filtrar y paginar datos desde archivos CSV de Google Sheets.
 * @version 1.0
 * @date 2023-10-27
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * @constant {Object} csvUrls - URLs de los archivos CSV de Google Sheets.
     */
    const csvUrls = {
        'TATIANA': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnel9gFxwiiXCxfIFh6AFFfLU2wV5UwVTpWZyyQHOSXspGGxr-x9F_lbOaNkudPEZcnBxrR_kT3GZu/pub?gid=2016677684&single=true&output=csv',
        'MARTHA': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnel9gFxwiiXCxfIFh6AFFfLU2wV5UwVTpWZyyQHOSXspGGxr-x9F_lbOaNkudPEZcnBxrR_kT3GZu/pub?gid=512945401&single=true&output=csv',
        'INGRID': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnel9gFxwiiXCxfIFh6AFFfLU2wV5UwVTpWZyyQHOSXspGGxr-x9F_lbOaNkudPEZcnBxrR_kT3GZu/pub?gid=1311906305&single=true&output=csv',
        'NICOL': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnel9gFxwiiXCxfIFh6AFFfLU2wV5UwVTpWZyyQHOSXspGGxr-x9F_lbOaNkudPEZcnBxrR_kT3GZu/pub?gid=1839129650&single=true&output=csv',
    };
    const searchInput = document.getElementById('searchInput');
    const monthSelect = document.getElementById('monthSelect');
    const liderSelect = document.getElementById('liderSelect');
    const dataTable = document.getElementById('dataTable');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    const paginationControls = document.getElementById('paginationControls');
    let data = [];
    let filteredData = [];
    let headers = [];
    let currentPage = 1;
    let currentPageSize = pageSizeSelect ? parseInt(pageSizeSelect.value, 10) : 10;

    /**
     * @function parseCSV
     * @description Parsea un texto en formato CSV a un array de arrays.
     * @param {string} text - El texto en formato CSV.
     * @returns {Array<Array<string>>} - Un array de filas, donde cada fila es un array de columnas.
     */
    function parseCSV(text) {
        const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim() !== '');
        const rows = lines.map(line => {
            const cols = [];
            let cur = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') { // doble comilla => comilla literal
                        cur += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    cols.push(cur);
                    cur = '';
                } else {
                    cur += ch;
                }
            }
            cols.push(cur);
            return cols.map(c => c.trim());
        });
        return rows;
    }

    /**
     * @function loadAndRenderData
     * @description Carga los datos desde los archivos CSV y los renderiza en la tabla.
     * @param {string} lider - El nombre del líder para cargar los datos correspondientes.
     */
    function loadAndRenderData(lider) {
        const leadersOrder = ['TATIANA', 'MARTHA', 'INGRID', 'NICOL',];
        let urlsToFetch = [];

        if (lider === 'TODOS') {
            urlsToFetch = leadersOrder.map(name => csvUrls[name]);
        } else if (csvUrls[lider]) {
            urlsToFetch.push(csvUrls[lider]);
        } else {
            console.error('URL de CSV no encontrada para el líder:', lider);
            return;
        }

        const fetchPromises = urlsToFetch.map(url => fetch(url).then(res => {
            if (!res.ok) throw new Error(`Error al obtener CSV de ${url}`);
            return res.text();
        }));

        Promise.all(fetchPromises)
            .then(csvTexts => {
                let combinedRows = [];
                let isFirstCsv = true;

                csvTexts.forEach(text => {
                    const rows = parseCSV(text);
                    if (rows.length === 0) return;

                    if (isFirstCsv) {
                        headers = rows[0].map(h => h || 'col');
                        combinedRows.push(...rows.slice(1));
                        isFirstCsv = false;
                    } else {
                        combinedRows.push(...rows.slice(1)); // Skip header for subsequent files
                    }
                });
                
                data = combinedRows.map(r => {
                    const obj = {};
                    headers.forEach((h, i) => {
                        obj[h] = r[i] !== undefined ? r[i] : '';
                    });
                    return obj;
                });

                applyFiltersAndRender();
            })
            .catch(err => {
                console.error('Error al cargar uno o más CSVs:', err);
                if (dataTable) dataTable.innerHTML = '<div class="text-danger">No se pudieron cargar los datos.</div>';
            });
    }

    /**
     * @function init
     * @description Inicializa la carga de datos.
     */
    function init() {
        const initialLider = liderSelect ? liderSelect.value : 'TODOS';
        loadAndRenderData(initialLider);
    }

    /**
     * @function monthFromValue
     * @description Obtiene el número del mes a partir de un valor de fecha.
     * @param {string} val - El valor de la fecha.
     * @returns {number|null} - El número del mes (1-12) o null si no es válido.
     */
    function monthFromValue(val) {
        if (!val) return null;
        // Parsea específicamente para formato dd/mm/yyyy.
        const parts = val.split(/[\/\-\.]/);
        if (parts.length >= 3) {
            // Asume que el mes es el segundo componente (índice 1)
            const month = parseInt(parts[1], 10);
            if (!isNaN(month) && month >= 1 && month <= 12) {
                return month;
            }
        }
        return null;
    }

    /**
     * @function matchesMonth
     * @description Verifica si un objeto coincide con un número de mes.
     * @param {Object} obj - El objeto a verificar.
     * @param {number} monthNumber - El número del mes a comparar.
     * @returns {boolean} - `true` si coincide, `false` en caso contrario.
     */
    function matchesMonth(obj, monthNumber) {
        if (!monthNumber) return true;
        if (!headers || headers.length === 0) return false;

        const firstColumnKey = headers[0];
        const dateValue = obj[firstColumnKey];
        const m = monthFromValue(dateValue);
        
        return m === monthNumber;
    }

    /**
     * @function matchesSearch
     * @description Verifica si un objeto coincide con un término de búsqueda.
     * @param {Object} obj - El objeto a verificar.
     * @param {string} term - El término de búsqueda.
     * @returns {boolean} - `true` si coincide, `false` en caso contrario.
     */
    function matchesSearch(obj, term) {
        if (!term) return true;
        const t = term.toLowerCase();
        // busca coincidencias en cualquier campo de texto
        for (const k of Object.keys(obj)) {
            const v = (obj[k] || '').toString().toLowerCase();
            if (v.includes(t)) return true;
        }
        return false;
    }

    /**
     * @function applyFiltersAndRender
     * @description Aplica los filtros y renderiza la tabla.
     */
    function applyFiltersAndRender() {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const monthVal = monthSelect ? monthSelect.value : '';
        const monthNumber = monthVal ? parseInt(monthVal, 10) : null;
        
        filteredData = data.filter(row => matchesSearch(row, searchTerm) && matchesMonth(row, monthNumber));
        currentPage = 1; // Reset to first page on any filter change
        
        renderTable();
        renderPagination();
    }

    /**
     * @function renderTable
     * @description Renderiza la tabla con los datos filtrados.
     */
    function renderTable() {
        if (!dataTable) return;
        if (!headers || headers.length === 0) {
            dataTable.innerHTML = '<div>No hay datos.</div>';
            return;
        }

        const start = (currentPage - 1) * currentPageSize;
        const end = start + currentPageSize;
        const rowsToShow = filteredData.slice(start, end);

        let html = '<div class="table-responsive custom-table-wrapper"><table class="table table-striped table-bordered table-sm">';
        html += '<thead class="thead-light"><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead>';
        html += '<tbody>';

        if (rowsToShow.length === 0) {
            html += `<tr><td colspan="${headers.length}" class="text-center">No se encontraron resultados</td></tr>`;
        } else {
            rowsToShow.forEach(row => {
                html += '<tr>';
                headers.forEach(h => {
                    html += `<td>${(row[h] !== undefined ? row[h] : '')}</td>`;
                });
                html += '</tr>';
            });
        }

        if (rowsToShow.length < currentPageSize) {
            const missing = currentPageSize - rowsToShow.length;
            for (let i = 0; i < missing; i++) {
                html += '<tr>';
                headers.forEach(() => html += '<td>&nbsp;</td>');
                html += '</tr>';
            }
        }

        html += '</tbody></table></div>';
        dataTable.innerHTML = html;
    }

    /**
     * @function renderPagination
     * @description Renderiza los controles de paginación.
     */
    function renderPagination() {
        if (!paginationControls) return;
        const totalPages = Math.ceil(filteredData.length / currentPageSize);
        if (totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        let html = '<nav><ul class="pagination pagination-sm">';

        // Previous button
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
                 </li>`;

        // Page numbers logic to show a maximum of 7 pages
        let startPage, endPage;
        if (totalPages <= 7) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 4) {
                startPage = 1;
                endPage = 7;
            } else if (currentPage + 3 >= totalPages) {
                startPage = totalPages - 6;
                endPage = totalPages;
            } else {
                startPage = currentPage - 3;
                endPage = currentPage + 3;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                html += `<li class="page-item active" aria-current="page">
                            <span class="page-link">${i}</span>
                         </li>`;
            } else {
                html += `<li class="page-item">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                         </li>`;
            }
        }

        // Next button
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
                 </li>`;

        html += '</ul></nav>';
        paginationControls.innerHTML = html;

        // Add event listeners
        paginationControls.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page, 10);
                if (page && page !== currentPage && page > 0 && page <= totalPages) {
                    currentPage = page;
                    renderTable();
                    renderPagination();
                }
            });
        });
    }

    /**
     * @function setupListeners
     * @description Configura los event listeners para los controles de filtro.
     */
    function setupListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', applyFiltersAndRender);
        }
        if (monthSelect) {
            monthSelect.addEventListener('change', applyFiltersAndRender);
        }
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', () => {
                currentPageSize = parseInt(pageSizeSelect.value, 10) || 10;
                applyFiltersAndRender();
            });
        }
        if (liderSelect) {
            liderSelect.addEventListener('change', (e) => {
                loadAndRenderData(e.target.value);
            });
        }
    }

    init();
    setupListeners();
    // asegurar que la barra de navegación muestre el primer item en móviles
    try {
        const nav = document.querySelector('.nav-menu');
        if (nav) {
            // resetear posición al cargar
            nav.scrollLeft = 0;
            // en redimensionamiento también
            window.addEventListener('resize', () => { nav.scrollLeft = 0; });
        }
    } catch (e) {
        // noop
    }
});
