// frontend/script.js

async function cargarBoletos() {
    try {
        // Buscamos el archivo que genera el BoletoRepository
        // Nota: Ajusta la ruta si tu JSON está en una carpeta distinta
        const respuesta = await fetch('../database.json');
        const datos = await respuesta.json();
        
        const tablaCuerpo = document.getElementById('lista-cuerpo');
        tablaCuerpo.innerHTML = ''; // Limpiar tabla

        datos.boletos.forEach(boleto => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${boleto.idBoleto}</td>
                <td>${boleto.pasajero}</td>
                <td>${servicioBadge(boleto.servicio)}</td>
                <td>$${boleto.montoTotal}</td>
                <td>${new Date(boleto.fechaEmision).toLocaleDateString()}</td>
            `;
            
            tablaCuerpo.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Función para darle color al tipo de servicio
function servicioBadge(servicio) {
    const estilo = servicio === 'VIP' ? 'background: #f1c40f; color: black;' : 'background: #3498db; color: white;';
    return `<span style="padding: 4px 8px; border-radius: 4px; font-weight: bold; ${estilo}">${servicio}</span>`;
}

// Cargar al iniciar la página
cargarBoletos();
// Opcional: Recargar cada 5 segundos para ver cambios en vivo
setInterval(cargarBoletos, 5000);