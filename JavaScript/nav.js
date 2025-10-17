/**
 * @file nav.js
 * @description Funciones para abrir y cerrar el menú de navegación móvil.
 * @version 1.0
 * @date 2023-10-27
 */

/**
 * @function openNav
 * @description Abre el menú de navegación móvil.
 */
function openNav() {
    document.getElementById("mobile-menu").style.width = "100%";
}

/**
 * @function closeNav
 * @description Cierra el menú de navegación móvil.
 */
function closeNav() {
    document.getElementById("mobile-menu").style.width = "0%";
}
