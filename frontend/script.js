document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btnBuscar');
    const inputFecha = document.getElementById('fechaIda');
    
    // Poner fecha de hoy por defecto
    const today = new Date().toISOString().split('T')[0];
    inputFecha.value = today;

    btnBuscar.addEventListener('click', async () => {
        const origen = "TACNA"; // Origen siempre Tacna
        const destino = document.getElementById('destino').value;
        const fecha = inputFecha.value;

        if(!fecha) {
            alert("Por favor selecciona una fecha");
            return;
        }

        console.log(`Buscando viajes desde ${origen} hacia ${destino} para el ${fecha}...`);
        
        // Simulación de llamada a tu API de Express
        const data = {
            nombre: "Cliente Web",
            dni: "00000000",
            telefono: "900000000",
            categoria: "Regular",
            origen: origen,
            destino: destino
        };

        const response = await fetch('/api/reservar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(`¡Buses encontrados para ${destino}! Revisa el database.json para ver la reserva.`);
        }
    });

    // Botones de las tarjetas de ruta
    document.querySelectorAll('.btn-reserve').forEach(button => {
        button.addEventListener('click', () => {
            const ruta = button.parentElement.querySelector('h4').innerText;
            alert(`Iniciando reserva para la ruta: ${ruta}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});