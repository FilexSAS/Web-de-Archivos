/**
 * @file script.js
 * @description Funcionalidad para descargar archivos desde la página.
 * @version 1.0
 * @date 2023-10-27
 */

document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const fileName = button.dataset.file;
            downloadFile(fileName);
        });
    });
});

/**
 * @function downloadFile
 * @description Descarga un archivo según el nombre proporcionado.
 * @param {string} fileName - El nombre del archivo a descargar.
 */
function downloadFile(fileName) {
    // Configura aquí las rutas reales de tus archivos
    const files = {
        'PDF Proceso de Organizacion': 'archivos/PDF Proceso de Organizacion.pdf',
        'PDF Proceso de Foliacion': 'archivos/PDF Proceso de Foliacion.pdf',
        'guia-fuid': null // No disponible aún
    };

    if (!files[fileName]) {
        alert('Esta guía aún no está disponible para descargar.');
        return;
    }

    // Implementa la descarga real
    const link = document.createElement('a');
    link.href = files[fileName];
    link.download = files[fileName].split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
