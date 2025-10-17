document.addEventListener('DOMContentLoaded', () => {
    const headerHTML = `
        <div class="logo">
            <img src="imagenes/img1.png" alt="Logo Filex" class="logo-img">
        </div>
        <nav>
           <ul class="nav-links">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="documentos.html">Documentos</a></li>
                <li><a href="produccion.html">Producción</a></li>
                <li><a href="contacto.html">Contacto</a></li>
           </ul>            
        </nav>
        <a onclick="openNav()" class="menu" href="#"><button>Menu</button></a>

        <div id="mobile-menu" class="overlay">
            <a onclick="closeNav()" href="" class="close">&times;</a>
            <div class="overlay-content">
                <a href="index.html">Inicio</a>
                <a href="documentos.html">Documentos</a>
                <a href="produccion.html">Producción</a>
                <a href="contacto.html">Contacto</a>
            </div>
        </div>
    `;

    const footerHTML = `
        <div class="footer-content">
            <div class="footer-section footer-contact">
                <div class="footer-company">
                    <span class="footer-company-name">DATOS DE CONTANTO SOPORTE WEB</span>
                    <div class="footer-info contact-info-grid">
                        <div class="contact-info-column">
                            <h4>Contacto</h4>
                            <span>+57 3052702985</span>
                            <span>torresdavid.fge@gmail.com</span>
                        </div>
                        <div class="contact-info-column">
                            <h4>Ubicación</h4>
                            <span>Direccion Bodega 1 Principal</span>
                            <span>Calle 21a #69B - 83</span>
                            <span style="margin-top: 5px;">Direccion Bodega 2</span>
                            <span>Calle 21a #70 - 58</span>
                            <span style="margin-top: 5px;">Bogotá - Colombia</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-section footer-links">
                <a href="index.html" class="footer-link">Inicio</a>
                <a href="documentos.html" class="footer-link">Documentos</a>
                <a href="produccion.html" class="footer-link">Producción</a>                  
                <a href="contacto.html" class="footer-link">Contacto</a>              
            </div>
            <div class="footer-section footer-logo-area">
                <img src="imagenes/img1.png" alt="Logo Filex" class="logo-img footer-logo-img-large">
            </div>
        </div>
    `;

    const header = document.querySelector('.header');
    const footer = document.querySelector('footer');

    if (header) {
        header.innerHTML = headerHTML;
    }

    if (footer) {
        footer.innerHTML = footerHTML;
    }
});
