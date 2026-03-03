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
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  // Elementos comunes
  const authContainer = document.getElementById('auth-container');
  const clientePanel = document.getElementById('cliente-panel');
  const adminPanel = document.getElementById('admin-panel');
  const conductorPanel = document.getElementById('conductor-panel');

  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  // Botones de logout (varios según panel)
  const logoutBtns = document.querySelectorAll('.logout-btn');

  // Elementos del panel cliente
  const clienteNameSpan = document.getElementById('cliente-name');
  const formReserva = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');
  const btnSubmit = document.getElementById('btnSubmit');
  const inputFecha = document.getElementById('fecha');

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
      default: // cliente
        clientePanel.style.display = 'block';
        clienteNameSpan.textContent = user.nombre || user.email;
        // Fecha mínima hoy
        const hoy = new Date().toISOString().split('T')[0];
        if (inputFecha) inputFecha.setAttribute('min', hoy);
        break;
    }
  }

  // Pestañas de login/registro
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
      
      // Mostrar mensaje de logout
      loginMessage.textContent = 'Sesión cerrada correctamente';
      loginMessage.className = 'message success';
    });
  });

  // ==================== FUNCIONES CLIENTE ====================
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

      if (!token) {
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
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          mensaje.textContent = `¡Reserva registrada con éxito! ID: ${result.reserva?.id || '—'}`;
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
    // Crear un modal simple con prompt (mejorable)
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