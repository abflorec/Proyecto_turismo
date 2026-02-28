const form = document.getElementById('reservaForm');
const tableBody = document.querySelector('#boletosTable tbody');

// Función para enviar reserva al servidor
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombre').value,
        dni: document.getElementById('dni').value,
        telefono: document.getElementById('telefono').value,
        categoria: document.getElementById('categoria').value
    };

    const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("✅ Reserva procesada por el sistema");
        form.reset();
        cargarBoletos(); // Recarga la tabla
    }
});

// Función para cargar los boletos guardados en el JSON
async function cargarBoletos() {
    const response = await fetch('/api/boletos');
    const boletos = await response.json();

    tableBody.innerHTML = boletos.map(b => `
        <tr>
            <td>${b.boleto.codigo}</td>
            <td>${b.cliente}</td>
            <td>${b.reserva.pasajero.dni}</td>
            <td>$${b.boleto.precio}</td>
            <td>Confirmada</td>
        </tr>
    `).join('');
}

// Cargar al iniciar
cargarBoletos();