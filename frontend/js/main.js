// frontend/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // ── Elementos del DOM ────────────────────────────────────────
    const form      = document.getElementById('formReserva');
    const mensaje   = document.getElementById('mensaje');
    const btnSubmit = document.getElementById('btnSubmit');
    const inputFecha = document.getElementById('fecha');

    if (!form || !mensaje || !btnSubmit || !inputFecha) {
        console.error('No se encontraron elementos esenciales del formulario');
        return;
    }

    // Establecer fecha mínima = hoy (lo que antes estaba inline)
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);

    // ── Manejo del envío del formulario ──────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar mensaje anterior
        mensaje.textContent = '';
        mensaje.className = '';

        // Deshabilitar botón y cambiar texto
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                mensaje.textContent = `¡Reserva registrada con éxito! ID: ${result.reserva?.id || '—'}`;
                mensaje.className = 'success';
                form.reset();
            } else {
                mensaje.textContent = result.error || 'Error al registrar la reserva';
                mensaje.className = 'error';
            }

        } catch (err) {
            console.error('Error en la petición:', err);
            mensaje.textContent = 'No se pudo conectar con el servidor. Intenta más tarde.';
            mensaje.className = 'error';
        } finally {
            // Siempre restauramos el botón
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Registrar Reserva';
        }
    });
});