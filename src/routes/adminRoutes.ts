import { Router, Response } from 'express';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';
import { UsuarioRepository } from '../Repositories/UsuarioRepository';
import { BusRepository } from '../Repositories/BusRepository';
import { ViajeRepository } from '../Repositories/ViajeRepository';
import { ReservaRepository } from '../Repositories/ReservaRepository';
import { RutaRepository } from '../Repositories/RutaRepository';
import { Usuario, Rol } from '../core/entities/Usuario';
import { Bus } from '../core/entities/Bus';
import { Viaje } from '../core/entities/Viaje';
import { RutaTuristica } from '../core/entities/RutaTuristica';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const router = Router();
const userRepo = new UsuarioRepository();
const busRepo = new BusRepository();
const viajeRepo = new ViajeRepository();
const reservaRepo = new ReservaRepository();
const rutaRepo = new RutaRepository();

// ==================== CRUD DE USUARIOS ====================
router.get('/admin/usuarios', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const usuarios = await userRepo.findAll();
    res.json(usuarios.map(u => u.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.post('/admin/usuarios', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, rol, nombre, telefono, dni, licencia } = req.body;
    if (!email || !password || !rol) {
      return res.status(400).json({ error: 'Email, password y rol requeridos' });
    }
    if (!Object.values(Rol).includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const existe = await userRepo.findByEmail(email);
    if (existe) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const nuevoUsuario = new Usuario(
      Date.now(),
      email,
      passwordHash,
      rol,
      nombre,
      telefono,
      dni,
      licencia
    );
    await userRepo.create(nuevoUsuario);
    res.status(201).json(nuevoUsuario.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/admin/usuarios/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { email, rol, nombre, telefono, dni, licencia } = req.body;
    const usuario = await userRepo.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (email) usuario.email = email;
    if (rol && Object.values(Rol).includes(rol)) usuario.rol = rol;
    if (nombre !== undefined) usuario.nombre = nombre;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (dni !== undefined) usuario.dni = dni;
    if (licencia !== undefined) usuario.licencia = licencia;
    await userRepo.update(usuario);
    res.json(usuario.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

router.delete('/admin/usuarios/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await userRepo.delete(id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ==================== CRUD DE BUSES ====================
router.get('/admin/buses', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const buses = await busRepo.findAll();
    res.json(buses.map(b => b.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener buses' });
  }
});

router.post('/admin/buses', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { placa, capacidad, modelo } = req.body;
    if (!placa || !capacidad || !modelo) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
    const id = Date.now();
    const nuevoBus = new Bus(id, placa, capacidad, modelo);
    await busRepo.create(nuevoBus);
    res.status(201).json(nuevoBus.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Error al crear bus' });
  }
});

router.put('/admin/buses/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { placa, capacidad, modelo, estado } = req.body;
    const bus = await busRepo.findById(id);
    if (!bus) return res.status(404).json({ error: 'Bus no encontrado' });
    if (placa) bus.placa = placa;
    if (capacidad) bus.capacidad = capacidad;
    if (modelo) bus.modelo = modelo;
    if (estado) bus.estado = estado;
    await busRepo.update(bus);
    res.json(bus.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar bus' });
  }
});

router.delete('/admin/buses/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await busRepo.delete(id);
    res.json({ message: 'Bus eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar bus' });
  }
});

// ==================== CRUD DE RUTAS ====================
router.get('/admin/rutas', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const rutas = await rutaRepo.findAll();
    res.json(rutas.map(r => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
});

router.post('/admin/rutas', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { idRuta, nombre, origen, destino, duracionEstimadaHoras, precioBase, paradas } = req.body;
    if (!idRuta || !nombre || !origen || !destino || !duracionEstimadaHoras || !precioBase) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const nuevaRuta = new RutaTuristica(idRuta, nombre, origen, destino, duracionEstimadaHoras, precioBase);
    if (paradas && Array.isArray(paradas)) {
      paradas.forEach((p: string) => nuevaRuta.agregarParada(p));
    }
    await rutaRepo.create(nuevaRuta);
    res.status(201).json(nuevaRuta.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear ruta' });
  }
});

router.put('/admin/rutas/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { nombre, origen, destino, duracionEstimadaHoras, precioBase, paradas } = req.body;
    const ruta = await rutaRepo.findById(id);
    if (!ruta) return res.status(404).json({ error: 'Ruta no encontrada' });
    if (nombre) ruta.nombre = nombre;
    if (origen) ruta.origen = origen;
    if (destino) ruta.destino = destino;
    if (duracionEstimadaHoras) ruta.duracionEstimadaHoras = duracionEstimadaHoras;
    if (precioBase) ruta.precioBase = precioBase;
    if (paradas && Array.isArray(paradas)) {
      ruta.setParadas(paradas);
    }
    await rutaRepo.update(ruta);
    res.json(ruta.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar ruta' });
  }
});

router.delete('/admin/rutas/:id', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    await rutaRepo.delete(id);
    res.json({ message: 'Ruta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar ruta' });
  }
});

// ==================== CRUD DE VIAJES ====================
router.get('/admin/viajes', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const viajes = await viajeRepo.findAll();
    res.json(viajes.map(v => v.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

router.post('/admin/viajes', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { rutaId, busId, fechaHoraSalida, conductorId } = req.body;
    if (!rutaId || !busId || !fechaHoraSalida || !conductorId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const ruta = await rutaRepo.findById(rutaId);
    if (!ruta) return res.status(400).json({ error: 'Ruta no encontrada' });
    const bus = await busRepo.findById(busId);
    if (!bus) return res.status(400).json({ error: 'Bus no encontrado' });
    const conductor = await userRepo.findById(conductorId);
    if (!conductor || conductor.rol !== Rol.CONDUCTOR) {
      return res.status(400).json({ error: 'Conductor no válido' });
    }
    const idViaje = `VIAJE-${Date.now()}`;
    const viaje = new Viaje(idViaje, ruta, bus, new Date(fechaHoraSalida), conductorId);
    await viajeRepo.create(viaje);
    res.status(201).json({ message: 'Viaje creado', viaje: viaje.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear viaje' });
  }
});

// ==================== REPORTE DE RESERVAS ====================
router.get('/admin/reporte', authMiddleware, roleMiddleware(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const reservas = await reservaRepo.findAll();
    let contenido = 'REPORTE DE RESERVAS\n';
    contenido += '===================\n\n';
    reservas.forEach((r, i) => {
      contenido += `Reserva ${i+1}:\n`;
      contenido += `ID: ${r.id}\n`;
      contenido += `Pasajero: ${r.pasajero.nombre} (${r.pasajero.email})\n`;
      contenido += `Teléfono: ${r.pasajero.telefono}\n`;
      contenido += `Tipo: ${r.tipoBoleto}\n`;
      contenido += `Ruta: ${r.ruta}\n`;
      contenido += `Fecha viaje: ${r.fecha}\n`;
      contenido += `Fecha registro: ${r.fechaRegistro}\n`;
      contenido += `Usuario ID: ${r.userId}\n`;
      contenido += '-------------------\n';
    });
    const filePath = path.join(process.cwd(), 'temp', `reporte_${Date.now()}.txt`);
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    fs.writeFileSync(filePath, contenido, 'utf-8');
    res.download(filePath, 'reporte_reservas.txt', (err) => {
      if (err) console.error(err);
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

export default router;