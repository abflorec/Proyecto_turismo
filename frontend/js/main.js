// frontend/js/main.js

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

  // Elementos del panel admin (se irán agregando listeners dinámicamente)
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

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginMessage.textContent = 'Iniciando sesión...';
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
      } else {
        loginMessage.textContent = data.error || 'Error al iniciar sesión';
        loginMessage.className = 'message error';
      }
    } catch (err) {
      console.error(err);
      loginMessage.textContent = 'Error de conexión';
      loginMessage.className = 'message error';
    }
  });

  // Registro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('register-nombre').value;
    const email = document.getElementById('register-email').value;
    const telefono = document.getElementById('register-telefono').value;
    const password = document.getElementById('register-password').value;

    registerMessage.textContent = 'Registrando...';
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
      } else {
        registerMessage.textContent = data.error || 'Error al registrarse';
        registerMessage.className = 'message error';
      }
    } catch (err) {
      console.error(err);
      registerMessage.textContent = 'Error de conexión';
      registerMessage.className = 'message error';
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
    });
  });

  // ==================== FUNCIONES CLIENTE ====================
  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();

      mensaje.textContent = '';
      mensaje.className = 'message';
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Enviando...';

      const formData = new FormData(formReserva);
      const data = Object.fromEntries(formData);
      const token = localStorage.getItem('token');

      if (!token) {
        mensaje.textContent = 'No estás autenticado';
        mensaje.className = 'message error';
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Registrar Reserva';
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
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Registrar Reserva';
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
    try {
      const res = await fetch('/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usuarios = await res.json();
      const div = document.getElementById('usuarios-list');
      div.innerHTML = '<h3>Lista de Usuarios</h3>';
      usuarios.forEach(u => {
        div.innerHTML += `<p>${u.id} - ${u.email} - ${u.rol} - ${u.nombre || ''}</p>`;
      });
    } catch (err) {
      alert('Error al listar usuarios');
    }
  }

  async function listarBuses() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/admin/buses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const buses = await res.json();
      const div = document.getElementById('buses-list');
      div.innerHTML = '<h3>Lista de Buses</h3>';
      buses.forEach(b => {
        div.innerHTML += `<p>${b.id} - ${b.placa} - ${b.modelo} - Capacidad: ${b.capacidad}</p>`;
      });
    } catch (err) {
      alert('Error al listar buses');
    }
  }

  async function listarRutas() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/admin/rutas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rutas = await res.json();
      const div = document.getElementById('rutas-list');
      div.innerHTML = '<h3>Lista de Rutas</h3>';
      rutas.forEach(r => {
        div.innerHTML += `<p>${r.idRuta} - ${r.nombre} (${r.origen} → ${r.destino}) - Precio: ${r.precioBase}</p>`;
      });
    } catch (err) {
      alert('Error al listar rutas');
    }
  }

  async function listarViajes() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/admin/viajes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const viajes = await res.json();
      const div = document.getElementById('viajes-list');
      div.innerHTML = '<h3>Lista de Viajes</h3>';
      viajes.forEach(v => {
        div.innerHTML += `<p>${v.idViaje} - Ruta: ${v.ruta?.nombre} - Bus: ${v.busId} - Conductor: ${v.conductorId} - Fecha: ${new Date(v.fechaHoraSalida).toLocaleString()}</p>`;
      });
    } catch (err) {
      alert('Error al listar viajes');
    }
  }

  function crearUsuarioForm() {
    // Aquí podrías mostrar un formulario dinámico, por simplicidad usamos prompt
    const email = prompt('Email:');
    const password = prompt('Contraseña:');
    const rol = prompt('Rol (cliente/admin/conductor):');
    const nombre = prompt('Nombre (opcional):');
    const telefono = prompt('Teléfono (opcional):');
    const dni = prompt('DNI (opcional, solo para conductor):');
    const licencia = prompt('Licencia (opcional, solo para conductor):');
    if (email && password && rol) {
      crearUsuario({ email, password, rol, nombre, telefono, dni, licencia });
    }
  }

  async function crearUsuario(datos) {
    const token = localStorage.getItem('token');
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
        alert('Usuario creado');
        listarUsuarios();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  function crearBusForm() {
    const placa = prompt('Placa:');
    const capacidad = prompt('Capacidad:');
    const modelo = prompt('Modelo:');
    if (placa && capacidad && modelo) {
      crearBus({ placa, capacidad: parseInt(capacidad), modelo });
    }
  }

  async function crearBus(datos) {
    const token = localStorage.getItem('token');
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
        alert('Bus creado');
        listarBuses();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  function crearRutaForm() {
    const idRuta = prompt('ID de ruta:');
    const nombre = prompt('Nombre:');
    const origen = prompt('Origen:');
    const destino = prompt('Destino:');
    const duracion = prompt('Duración estimada (horas):');
    const precio = prompt('Precio base:');
    if (idRuta && nombre && origen && destino && duracion && precio) {
      crearRuta({
        idRuta,
        nombre,
        origen,
        destino,
        duracionEstimadaHoras: parseFloat(duracion),
        precioBase: parseFloat(precio)
      });
    }
  }

  async function crearRuta(datos) {
    const token = localStorage.getItem('token');
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
        alert('Ruta creada');
        listarRutas();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  function crearViajeForm() {
    const rutaId = prompt('ID de ruta:');
    const busId = prompt('ID del bus:');
    const fechaHoraSalida = prompt('Fecha y hora de salida (YYYY-MM-DDTHH:MM):');
    const conductorId = prompt('ID del conductor:');
    if (rutaId && busId && fechaHoraSalida && conductorId) {
      crearViaje({ rutaId, busId: parseInt(busId), fechaHoraSalida, conductorId: parseInt(conductorId) });
    }
  }

  async function crearViaje(datos) {
    const token = localStorage.getItem('token');
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
        alert('Viaje creado');
        listarViajes();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  async function descargarReporte() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/admin/reporte', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_reservas.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Error al generar reporte');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  // ==================== FUNCIONES CONDUCTOR ====================
  if (conductorDatosForm) {
    conductorDatosForm.addEventListener('submit', async (e) => {
      e.preventDefault();
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
          body: JSON.stringify({ dni, licencia, busId: busId ? parseInt(busId) : undefined })
        });
        if (res.ok) {
          alert('Datos guardados');
        } else {
          const err = await res.json();
          alert('Error: ' + err.error);
        }
      } catch (err) {
        alert('Error de conexión');
      }
    });

    btnMisViajes.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/conductor/viajes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const viajes = await res.json();
        const div = document.getElementById('viajes-conductor-list');
        div.innerHTML = '<h3>Mis Viajes</h3>';
        viajes.forEach(v => {
          div.innerHTML += `<p>${v.idViaje} - Fecha: ${new Date(v.fechaHoraSalida).toLocaleString()}</p>`;
        });
      } catch (err) {
        alert('Error al obtener viajes');
      }
    });

    btnBusesDisponibles.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/conductor/buses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const buses = await res.json();
        const div = document.getElementById('buses-disponibles-list');
        div.innerHTML = '<h3>Buses Disponibles</h3>';
        buses.forEach(b => {
          div.innerHTML += `<p>${b.id} - ${b.placa} - ${b.modelo}</p>`;
        });
      } catch (err) {
        alert('Error al obtener buses');
      }
    });
  }
});