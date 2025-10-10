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

    // Simulación de descarga - reemplaza con la ruta real del archivo
    //alert(`Iniciando descarga de: ${fileName}`);

    // Implementa la descarga real
    const link = document.createElement('a');
    link.href = files[fileName];
    link.download = files[fileName].split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
