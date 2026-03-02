import { Router, Response } from 'express';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';
import { UsuarioRepository } from '../Repositories/UsuarioRepository';
import { BusRepository } from '../Repositories/BusRepository';
import { ViajeRepository } from '../Repositories/ViajeRepository';

const router = Router();
const userRepo = new UsuarioRepository();
const busRepo = new BusRepository();
const viajeRepo = new ViajeRepository();

// Conductor: completar datos (DNI, licencia) 
// (El busId se ignora por ahora, pero podrías guardarlo si agregas el campo)
router.post('/conductor/datos', authMiddleware, roleMiddleware(['conductor']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const { dni, licencia } = req.body;
    const usuario = await userRepo.findById(userId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (dni) usuario.dni = dni;
    if (licencia) usuario.licencia = licencia;
    await userRepo.update(usuario);
    res.json({ message: 'Datos actualizados', usuario: usuario.toJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar datos' });
  }
});

// Conductor: ver lista de buses disponibles
router.get('/conductor/buses', authMiddleware, roleMiddleware(['conductor']), async (req: AuthRequest, res: Response) => {
  try {
    const buses = await busRepo.findAll();
    res.json(buses.map(b => b.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener buses' });
  }
});

// Conductor: ver viajes asignados (usando método del repositorio)
router.get('/conductor/viajes', authMiddleware, roleMiddleware(['conductor']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const viajes = await viajeRepo.findByConductorId(userId);
    res.json(viajes.map(v => v.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

export default router;