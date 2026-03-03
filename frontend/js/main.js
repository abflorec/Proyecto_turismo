// frontend/js/main.js

// Función para mostrar estado de carga en botones
function showLoading(button) {
  const originalText = button.textContent;
  const originalDisabled = button.disabled;
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span> Procesando...';
  
  // Retorna función para restaurar el botón
  return () => {
    button.disabled = originalDisabled;
    button.textContent = originalText;
  };
}

// Agregar estilos del spinner al documento
const style = document.createElement('style');
style.textContent = `
  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  button:disabled {
    opacity: 0.8;
    cursor: wait;
  }

  /* Estilos para el dashboard */
  .dashboard-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: #f3f4f6;
    padding: 0.5rem;
    border-radius: 0.75rem;
  }

  .dashboard-tab {
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    color: #1f2937;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }

  .dashboard-tab:hover {
    background: rgba(37, 99, 235, 0.1);
  }

  .dashboard-tab.active {
    background: #2563eb;
    color: white;
  }

  .dashboard-section {
    display: none;
  }

  .dashboard-section.active {
    display: block;
  }

  .reservas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .reserva-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .reserva-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563eb, #10b981);
  }

  .reserva-card.vip::before {
    background: linear-gradient(90deg, #f59e0b, #fbbf24);
  }

  .reserva-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .reserva-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .reserva-tipo {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .reserva-tipo.normal {
    background: #e5e7eb;
    color: #374151;
  }

  .reserva-tipo.vip {
    background: #fef3c7;
    color: #92400e;
  }

  .badge-success {
    background: #d1fae5;
    color: #065f46;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .reserva-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #6b7280;
  }

  .reserva-info strong {
    color: #1f2937;
    margin-left: 0.25rem;
  }

  .reserva-fecha {
    display: inline-block;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #1f2937;
  }

  .reserva-footer {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .btn-cancelar {
    flex: 1;
    padding: 0.75rem;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-cancelar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .btn-pagar {
    flex: 1;
    padding: 0.75rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-pagar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .modal h3 {
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .modal p {
    margin-bottom: 1.5rem;
    color: #6b7280;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
  }

  .modal-btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .modal-btn.cancelar {
    background: #f3f4f6;
    color: #1f2937;
  }

  .modal-btn.cancelar:hover {
    background: #e5e7eb;
  }

  .modal-btn.confirmar {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
  }

  .modal-btn.confirmar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .no-reservas {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    background: #f3f4f6;
    border-radius: 0.75rem;
    color: #6b7280;
  }

  .no-reservas i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2563eb;
  }

  .btn-reservar-ahora {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .btn-reservar-ahora:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .loading-reservas {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
  }

  .loading-reservas .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
    margin-bottom: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .reservas-grid {
      grid-template-columns: 1fr;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .dashboard-tabs {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  // Elementos comunes
  const authContainer = document.getElementById('auth-container');
  const clientePanel = document.getElementById('cliente-panel');
  const clienteDashboard = document.getElementById('cliente-dashboard');
  const adminPanel = document.getElementById('admin-panel');
  const conductorPanel = document.getElementById('conductor-panel');

  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  // Botones de logout
  const logoutBtns = document.querySelectorAll('.logout-btn');

  // Elementos del panel cliente original
  const clienteNameSpan = document.getElementById('cliente-name');
  const formReserva = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');
  const btnSubmit = document.getElementById('btnSubmit');
  const inputFecha = document.getElementById('fecha');

  // Elementos del DASHBOARD cliente
  const clienteDashboardName = document.getElementById('cliente-dashboard-name');
  const reservasList = document.getElementById('reservas-list');
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  const formReservaDashboard = document.getElementById('formReservaDashboard');
  const dashboardMensaje = document.getElementById('dashboard-mensaje');
  const btnSubmitDashboard = document.getElementById('btnSubmitDashboard');
  const dashboardFecha = document.getElementById('dashboard-fecha');
  const dashboardNombre = document.getElementById('dashboard-nombre');
  const dashboardEmail = document.getElementById('dashboard-email');
  const dashboardTelefono = document.getElementById('dashboard-telefono');

  // Elementos del panel admin
  const adminNameSpan = document.getElementById('admin-name');
  const btnListUsuarios = document.getElementById('btn-list-usuarios');
  const btnCreateUsuario = document.getElementById('btn-create-usuario');
  const btnListBuses = document.getElementById('btn-list-buses');
  const btnCreateBus = document.getElementById('btn-create-bus');
  const btnListRutas = document.getElementById('btn-list-rutas');
  const btnCreateRuta = document.getElementById('btn-create-ruta');
  const btnListViajes = document.getElementById('btn-list-viajes');
  const btnCreateViaje = document.getElementById('btn-create-viaje');
  const btnReporte = document.getElementById('btn-reporte');

  // Elementos del panel conductor
  const conductorNameSpan = document.getElementById('conductor-name');
  const conductorDatosForm = document.getElementById('conductor-datos-form');
  const btnMisViajes = document.getElementById('btn-mis-viajes');
  const btnBusesDisponibles = document.getElementById('btn-buses-disponibles');

  // Verificar token al cargar
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (token && user) {
    mostrarPanelSegunRol(user);
  } else {
    mostrarAuth();
  }

  function mostrarAuth() {
    authContainer.style.display = 'block';
    clientePanel.style.display = 'none';
    clienteDashboard.style.display = 'none';
    adminPanel.style.display = 'none';
    conductorPanel.style.display = 'none';
  }

  function mostrarPanelSegunRol(user) {
    authContainer.style.display = 'none';
    switch (user.rol) {
      case 'admin':
        adminPanel.style.display = 'block';
        adminNameSpan.textContent = user.nombre || user.email;
        break;
      case 'conductor':
        conductorPanel.style.display = 'block';
        conductorNameSpan.textContent = user.nombre || user.email;
        break;
      default: // cliente - USAR EL NUEVO DASHBOARD
        clienteDashboard.style.display = 'block';
        clientePanel.style.display = 'none';
        clienteDashboardName.textContent = user.nombre || user.email;
        
        // Precargar datos del usuario en el formulario
        if (user.nombre) dashboardNombre.value = user.nombre;
        if (user.email) dashboardEmail.value = user.email;
        if (user.telefono) dashboardTelefono.value = user.telefono;
        
        // Fecha mínima hoy
        const hoy = new Date().toISOString().split('T')[0];
        if (dashboardFecha) dashboardFecha.setAttribute('min', hoy);
        
        // Cargar reservas del usuario
        cargarReservas();
        break;
    }
  }

  // ==================== FUNCIONES DEL DASHBOARD ====================
  
  // Pestañas del dashboard
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashboardTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabId = tab.dataset.tab;
      dashboardSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === tabId) {
          section.classList.add('active');
        }
      });
    });
  });

  // Cargar reservas del usuario
  async function cargarReservas() {
    if (!reservasList) return;
    
    reservasList.innerHTML = `
      <div class="loading-reservas">
        <div class="spinner"></div>
        <p>Cargando tus reservas...</p>
      </div>
    `;

    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/reservas/mis-reservas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const reservas = await res.json();
        mostrarReservas(reservas);
      } else {
        reservasList.innerHTML = `
          <div class="no-reservas">
            <p>Error al cargar las reservas</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Error:', err);
      reservasList.innerHTML = `
        <div class="no-reservas">
          <p>Error de conexión</p>
        </div>
      `;
    }
  }

  // Mostrar reservas en grid
  function mostrarReservas(reservas) {
    if (!reservasList) return;
    
    if (reservas.length === 0) {
      reservasList.innerHTML = `
        <div class="no-reservas">
          <i>📭</i>
          <p>No tienes reservas activas</p>
          <button class="btn-reservar-ahora" onclick="document.querySelector('[data-tab=\\'nuevo-viaje\\']').click()">
            ✈️ Reservar mi primer viaje
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    reservas.forEach(reserva => {
      const fechaViaje = new Date(reserva.fecha).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const fechaRegistro = new Date(reserva.fechaRegistro).toLocaleDateString('es-PE');
      const esVIP = reserva.tipoBoleto === 'VIP';
      
      html += `
        <div class="reserva-card ${esVIP ? 'vip' : ''}" data-reserva-id="${reserva.id}">
          <div class="reserva-header">
            <span class="reserva-tipo ${esVIP ? 'vip' : 'normal'}">
              ${esVIP ? '👑 VIP' : '🎫 Normal'}
            </span>
            <span class="badge-success">Confirmada</span>
          </div>
          
          <div class="reserva-body">
            <div class="reserva-info">
              <span>👤</span>
              <span><strong>${reserva.pasajero.nombre}</strong></span>
            </div>
            
            <div class="reserva-info">
              <span>📍</span>
              <span>${reserva.ruta}</span>
            </div>
            
            <div class="reserva-info">
              <span>📅</span>
              <span>${fechaViaje}</span>
            </div>
            
            <div class="reserva-info">
              <span>📞</span>
              <span>${reserva.pasajero.telefono}</span>
            </div>
            
            <div class="reserva-fecha">
              Reservado: ${fechaRegistro}
            </div>
          </div>
          
          <div class="reserva-footer">
            <button class="btn-pagar" onclick="comprarBoleto(${reserva.id})">
              💰 Comprar Boleto
            </button>
            <button class="btn-cancelar" onclick="cancelarReserva(${reserva.id})">
              ❌ Cancelar
            </button>
          </div>
        </div>
      `;
    });
    
    reservasList.innerHTML = html;
  }

  // Función global para cancelar reserva
  window.cancelarReserva = async (reservaId) => {
    // Crear modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h3>❌ Cancelar Reserva</h3>
        <p>¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button class="modal-btn cancelar" id="modal-cancelar">No, mantener</button>
          <button class="modal-btn confirmar" id="modal-confirmar">Sí, cancelar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar botones del modal
    document.getElementById('modal-cancelar').onclick = () => {
      document.body.removeChild(modal);
    };
    
    document.getElementById('modal-confirmar').onclick = async () => {
      document.body.removeChild(modal);
      
      const token = localStorage.getItem('token');
      
      // Mostrar loading en la tarjeta específica
      const reservaCard = document.querySelector(`.reserva-card[data-reserva-id="${reservaId}"]`);
      if (!reservaCard) return;
      
      const originalHTML = reservaCard.innerHTML;
      reservaCard.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
          <p>Cancelando reserva...</p>
        </div>
      `;
      
      try {
        const res = await fetch(`/api/reservas/${reservaId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // Mostrar mensaje de éxito
          const mensajeExito = document.createElement('div');
          mensajeExito.className = 'message success';
          mensajeExito.textContent = '✅ Reserva cancelada exitosamente';
          mensajeExito.style.marginBottom = '1rem';
          
          const misViajesSection = document.querySelector('#mis-viajes');
          if (misViajesSection) {
            misViajesSection.prepend(mensajeExito);
          }
          
          // Eliminar el mensaje después de 3 segundos
          setTimeout(() => mensajeExito.remove(), 3000);
          
          // Recargar reservas
          cargarReservas();
        } else {
          // Restaurar la tarjeta y mostrar error
          reservaCard.innerHTML = originalHTML;
          alert('❌ Error: ' + (data.error || 'No se pudo cancelar la reserva'));
        }
      } catch (err) {
        console.error(err);
        reservaCard.innerHTML = originalHTML;
        alert('❌ Error de conexión');
      }
    };
  };

  // Función global para comprar boleto
  window.comprarBoleto = (reservaId) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h3>💰 Comprar Boleto</h3>
        <p>¿Deseas proceder con la compra del boleto para esta reserva?</p>
        <div class="modal-actions">
          <button class="modal-btn cancelar" id="modal-cancelar">Cancelar</button>
          <button class="modal-btn confirmar" id="modal-confirmar" style="background: linear-gradient(135deg, #10b981, #059669);">
            Pagar ahora
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('modal-cancelar').onclick = () => {
      document.body.removeChild(modal);
    };
    
    document.getElementById('modal-confirmar').onclick = async () => {
      document.body.removeChild(modal);
      
      const token = localStorage.getItem('token');
      
      try {
        const res = await fetch(`/api/reservas/${reservaId}/comprar`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await res.json();
        
        if (res.ok) {
          alert(`✅ ${data.message}\nCódigo de boleto: ${data.boleto.codigo}\nTotal: S/. ${data.boleto.total}`);
        } else {
          alert('❌ Error: ' + (data.error || 'No se pudo procesar la compra'));
        }
      } catch (err) {
        console.error(err);
        alert('❌ Error de conexión');
      }
    };
  };

  // Formulario de nueva reserva en dashboard
  if (formReservaDashboard) {
    formReservaDashboard.addEventListener('submit', async (e) => {
      e.preventDefault();

      const restoreButton = showLoading(btnSubmitDashboard);

      dashboardMensaje.textContent = '';
      dashboardMensaje.className = 'message';

      const formData = new FormData(formReservaDashboard);
      const data = Object.fromEntries(formData);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (!token || !user) {
        dashboardMensaje.textContent = 'No estás autenticado';
        dashboardMensaje.className = 'message error';
        restoreButton();
        return;
      }

      try {
        const response = await fetch('/api/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...data,
            userId: user.id
          })
        });

        const result = await response.json();

        if (response.ok) {
          dashboardMensaje.textContent = '✅ ¡Reserva registrada con éxito!';
          dashboardMensaje.className = 'message success';
          formReservaDashboard.reset();
          
          // Recargar reservas y cambiar a la pestaña de mis viajes
          await cargarReservas();
          document.querySelector('[data-tab="mis-viajes"]').click();
          
          // Precargar datos del usuario nuevamente
          if (user.nombre) dashboardNombre.value = user.nombre;
          if (user.email) dashboardEmail.value = user.email;
          if (user.telefono) dashboardTelefono.value = user.telefono;
        } else {
          dashboardMensaje.textContent = result.error || 'Error al registrar la reserva';
          dashboardMensaje.className = 'message error';
        }
      } catch (err) {
        console.error('Error:', err);
        dashboardMensaje.textContent = 'No se pudo conectar con el servidor.';
        dashboardMensaje.className = 'message error';
      } finally {
        restoreButton();
      }
    });
  }

  // ==================== PESTAÑAS DE LOGIN/REGISTRO ====================
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    loginMessage.textContent = '';
    loginMessage.className = 'message';
    registerMessage.textContent = '';
    registerMessage.className = 'message';
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    loginMessage.textContent = '';
    loginMessage.className = 'message';
    registerMessage.textContent = '';
    registerMessage.className = 'message';
  });

  // Login con loading
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginButton = e.target.querySelector('button[type="submit"]');
    const restoreButton = showLoading(loginButton);
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginMessage.textContent = '';
    loginMessage.className = 'message';

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        mostrarPanelSegunRol(data.user);
        loginMessage.textContent = '¡Login exitoso!';
        loginMessage.className = 'message success';
      } else {
        loginMessage.textContent = data.error || 'Error al iniciar sesión';
        loginMessage.className = 'message error';
      }
    } catch (err) {
      console.error(err);
      loginMessage.textContent = 'Error de conexión';
      loginMessage.className = 'message error';
    } finally {
      restoreButton();
    }
  });

  // Registro con loading
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const registerButton = e.target.querySelector('button[type="submit"]');
    const restoreButton = showLoading(registerButton);
    
    const nombre = document.getElementById('register-nombre').value;
    const email = document.getElementById('register-email').value;
    const telefono = document.getElementById('register-telefono').value;
    const password = document.getElementById('register-password').value;

    registerMessage.textContent = '';
    registerMessage.className = 'message';

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        mostrarPanelSegunRol(data.user);
        registerMessage.textContent = '¡Registro exitoso!';
        registerMessage.className = 'message success';
      } else {
        registerMessage.textContent = data.error || 'Error al registrarse';
        registerMessage.className = 'message error';
      }
    } catch (err) {
      console.error(err);
      registerMessage.textContent = 'Error de conexión';
      registerMessage.className = 'message error';
    } finally {
      restoreButton();
    }
  });

  // Logout (para todos los botones)
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      mostrarAuth();
      loginForm.reset();
      registerForm.reset();
      
      loginMessage.textContent = 'Sesión cerrada correctamente';
      loginMessage.className = 'message success';
    });
  });

  // ==================== FUNCIONES CLIENTE ORIGINAL (por compatibilidad) ====================
  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = e.target.querySelector('button[type="submit"]');
      const restoreButton = showLoading(submitBtn);

      mensaje.textContent = '';
      mensaje.className = 'message';

      const formData = new FormData(formReserva);
      const data = Object.fromEntries(formData);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (!token || !user) {
        mensaje.textContent = 'No estás autenticado';
        mensaje.className = 'message error';
        restoreButton();
        return;
      }

      try {
        const response = await fetch('/api/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...data,
            userId: user.id
          })
        });

        const result = await response.json();

        if (response.ok) {
          mensaje.textContent = '✅ ¡Reserva registrada con éxito!';
          mensaje.className = 'message success';
          formReserva.reset();
        } else {
          mensaje.textContent = result.error || 'Error al registrar la reserva';
          mensaje.className = 'message error';
        }
      } catch (err) {
        console.error('Error:', err);
        mensaje.textContent = 'No se pudo conectar con el servidor.';
        mensaje.className = 'message error';
      } finally {
        restoreButton();
      }
    });
  }

  // ==================== FUNCIONES ADMIN ====================
  if (btnListUsuarios) {
    btnListUsuarios.addEventListener('click', listarUsuarios);
    btnCreateUsuario.addEventListener('click', crearUsuarioForm);
    btnListBuses.addEventListener('click', listarBuses);
    btnCreateBus.addEventListener('click', crearBusForm);
    btnListRutas.addEventListener('click', listarRutas);
    btnCreateRuta.addEventListener('click', crearRutaForm);
    btnListViajes.addEventListener('click', listarViajes);
    btnCreateViaje.addEventListener('click', crearViajeForm);
    btnReporte.addEventListener('click', descargarReporte);
  }

  async function listarUsuarios() {
    const token = localStorage.getItem('token');
    const btn = event.target;
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usuarios = await res.json();
      const div = document.getElementById('usuarios-list');
      div.innerHTML = '<h3>📋 Lista de Usuarios</h3>';
      
      if (usuarios.length === 0) {
        div.innerHTML += '<p class="message info">No hay usuarios registrados</p>';
      } else {
        usuarios.forEach(u => {
          const rolIcon = u.rol === 'admin' ? '👑' : u.rol === 'conductor' ? '🚍' : '👤';
          div.innerHTML += `<p>${rolIcon} <strong>${u.nombre || 'Sin nombre'}</strong> - ${u.email} (${u.rol})</p>`;
        });
      }
    } catch (err) {
      alert('Error al listar usuarios');
    } finally {
      restoreButton();
    }
  }

  async function listarBuses() {
    const token = localStorage.getItem('token');
    const btn = event.target;
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/buses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const buses = await res.json();
      const div = document.getElementById('buses-list');
      div.innerHTML = '<h3>🚌 Lista de Buses</h3>';
      
      if (buses.length === 0) {
        div.innerHTML += '<p class="message info">No hay buses registrados</p>';
      } else {
        buses.forEach(b => {
          div.innerHTML += `<p>🚍 <strong>${b.placa}</strong> - ${b.modelo} - Capacidad: ${b.capacidad} asientos</p>`;
        });
      }
    } catch (err) {
      alert('Error al listar buses');
    } finally {
      restoreButton();
    }
  }

  async function listarRutas() {
    const token = localStorage.getItem('token');
    const btn = event.target;
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/rutas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rutas = await res.json();
      const div = document.getElementById('rutas-list');
      div.innerHTML = '<h3>🗺️ Lista de Rutas</h3>';
      
      if (rutas.length === 0) {
        div.innerHTML += '<p class="message info">No hay rutas registradas</p>';
      } else {
        rutas.forEach(r => {
          div.innerHTML += `<p>📍 <strong>${r.nombre}</strong> - ${r.origen} → ${r.destino} - S/. ${r.precioBase}</p>`;
        });
      }
    } catch (err) {
      alert('Error al listar rutas');
    } finally {
      restoreButton();
    }
  }

  async function listarViajes() {
    const token = localStorage.getItem('token');
    const btn = event.target;
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/viajes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const viajes = await res.json();
      const div = document.getElementById('viajes-list');
      div.innerHTML = '<h3>📅 Lista de Viajes</h3>';
      
      if (viajes.length === 0) {
        div.innerHTML += '<p class="message info">No hay viajes programados</p>';
      } else {
        viajes.forEach(v => {
          const fecha = new Date(v.fechaHoraSalida).toLocaleString();
          div.innerHTML += `<p>🚍 Viaje ${v.idViaje} - ${fecha} - Conductor ID: ${v.conductorId}</p>`;
        });
      }
    } catch (err) {
      alert('Error al listar viajes');
    } finally {
      restoreButton();
    }
  }

  function crearUsuarioForm() {
    const email = prompt('📧 Email:');
    if (!email) return;
    
    const password = prompt('🔑 Contraseña:');
    if (!password) return;
    
    const rol = prompt('👤 Rol (cliente/admin/conductor):');
    if (!rol || !['cliente', 'admin', 'conductor'].includes(rol)) {
      alert('Rol no válido');
      return;
    }
    
    const nombre = prompt('📝 Nombre (opcional):') || '';
    const telefono = prompt('📞 Teléfono (opcional):') || '';
    const dni = rol === 'conductor' ? prompt('🆔 DNI (opcional):') || '' : '';
    const licencia = rol === 'conductor' ? prompt('📄 Licencia (opcional):') || '' : '';
    
    crearUsuario({ email, password, rol, nombre, telefono, dni, licencia });
  }

  async function crearUsuario(datos) {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('btn-create-usuario');
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      
      if (res.ok) {
        alert('✅ Usuario creado exitosamente');
        listarUsuarios();
      } else {
        const err = await res.json();
        alert('❌ Error: ' + err.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      restoreButton();
    }
  }

  function crearBusForm() {
    const placa = prompt('🚌 Placa:');
    if (!placa) return;
    
    const capacidad = prompt('🪑 Capacidad:');
    if (!capacidad || isNaN(capacidad)) {
      alert('Capacidad no válida');
      return;
    }
    
    const modelo = prompt('🏭 Modelo:');
    if (!modelo) return;
    
    crearBus({ placa, capacidad: parseInt(capacidad), modelo });
  }

  async function crearBus(datos) {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('btn-create-bus');
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      
      if (res.ok) {
        alert('✅ Bus creado exitosamente');
        listarBuses();
      } else {
        const err = await res.json();
        alert('❌ Error: ' + err.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      restoreButton();
    }
  }

  function crearRutaForm() {
    const idRuta = prompt('🆔 ID de ruta:');
    if (!idRuta) return;
    
    const nombre = prompt('📛 Nombre:');
    if (!nombre) return;
    
    const origen = prompt('📍 Origen:');
    if (!origen) return;
    
    const destino = prompt('🏁 Destino:');
    if (!destino) return;
    
    const duracion = prompt('⏱️ Duración estimada (horas):');
    if (!duracion || isNaN(duracion)) {
      alert('Duración no válida');
      return;
    }
    
    const precio = prompt('💰 Precio base:');
    if (!precio || isNaN(precio)) {
      alert('Precio no válido');
      return;
    }
    
    crearRuta({
      idRuta,
      nombre,
      origen,
      destino,
      duracionEstimadaHoras: parseFloat(duracion),
      precioBase: parseFloat(precio)
    });
  }

  async function crearRuta(datos) {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('btn-create-ruta');
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/rutas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      
      if (res.ok) {
        alert('✅ Ruta creada exitosamente');
        listarRutas();
      } else {
        const err = await res.json();
        alert('❌ Error: ' + err.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      restoreButton();
    }
  }

  function crearViajeForm() {
    const rutaId = prompt('🆔 ID de ruta:');
    if (!rutaId) return;
    
    const busId = prompt('🚍 ID del bus:');
    if (!busId || isNaN(busId)) {
      alert('ID de bus no válido');
      return;
    }
    
    const fechaHoraSalida = prompt('📅 Fecha y hora (YYYY-MM-DDTHH:MM):');
    if (!fechaHoraSalida) return;
    
    const conductorId = prompt('👤 ID del conductor:');
    if (!conductorId || isNaN(conductorId)) {
      alert('ID de conductor no válido');
      return;
    }
    
    crearViaje({ 
      rutaId, 
      busId: parseInt(busId), 
      fechaHoraSalida, 
      conductorId: parseInt(conductorId) 
    });
  }

  async function crearViaje(datos) {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('btn-create-viaje');
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/viajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      
      if (res.ok) {
        alert('✅ Viaje creado exitosamente');
        listarViajes();
      } else {
        const err = await res.json();
        alert('❌ Error: ' + err.error);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      restoreButton();
    }
  }

  async function descargarReporte() {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('btn-reporte');
    const restoreButton = showLoading(btn);
    
    try {
      const res = await fetch('/admin/reporte', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_reservas_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('❌ Error al generar reporte');
      }
    } catch (err) {
      alert('❌ Error de conexión');
    } finally {
      restoreButton();
    }
  }

  // ==================== FUNCIONES CONDUCTOR ====================
  if (conductorDatosForm) {
    conductorDatosForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const restoreButton = showLoading(submitBtn);
      
      const dni = document.getElementById('dni').value;
      const licencia = document.getElementById('licencia').value;
      const busId = document.getElementById('bus-preferido').value;
      const token = localStorage.getItem('token');
      
      try {
        const res = await fetch('/conductor/datos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            dni, 
            licencia, 
            busId: busId ? parseInt(busId) : undefined 
          })
        });
        
        if (res.ok) {
          alert('✅ Datos guardados correctamente');
        } else {
          const err = await res.json();
          alert('❌ Error: ' + err.error);
        }
      } catch (err) {
        alert('❌ Error de conexión');
      } finally {
        restoreButton();
      }
    });

    btnMisViajes.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      const btn = event.target;
      const restoreButton = showLoading(btn);
      
      try {
        const res = await fetch('/conductor/viajes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const viajes = await res.json();
        const div = document.getElementById('viajes-conductor-list');
        div.innerHTML = '<h3>📅 Mis Viajes Asignados</h3>';
        
        if (viajes.length === 0) {
          div.innerHTML += '<p class="message info">No tienes viajes asignados</p>';
        } else {
          viajes.forEach(v => {
            const fecha = new Date(v.fechaHoraSalida).toLocaleString();
            div.innerHTML += `<p>🚍 Viaje ${v.idViaje} - ${fecha}</p>`;
          });
        }
      } catch (err) {
        alert('❌ Error al obtener viajes');
      } finally {
        restoreButton();
      }
    });
  
    
    btnBusesDisponibles.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      const btn = event.target;
      const restoreButton = showLoading(btn);
      
      try {
        const res = await fetch('/conductor/buses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const buses = await res.json();
        const div = document.getElementById('buses-disponibles-list');
        div.innerHTML = '<h3>🚌 Buses Disponibles</h3>';
        
        if (buses.length === 0) {
          div.innerHTML += '<p class="message info">No hay buses disponibles</p>';
        } else {
          buses.forEach(b => {
            div.innerHTML += `<p>🚍 ${b.placa} - ${b.modelo} (Capacidad: ${b.capacidad})</p>`;
          });
        }
      } catch (err) {
        alert('❌ Error al obtener buses');
      } finally {
        restoreButton();
      }
    });
  }
});