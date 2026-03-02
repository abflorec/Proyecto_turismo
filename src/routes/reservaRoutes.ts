import { Router, Response } from 'express';
import { ReservaRepository } from '../Repositories/ReservaRepository';
import { Reserva, TipoBoleto } from '../core/entities/Reserva';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const repo = new ReservaRepository();

// POST /api/reservas - solo clientes (o también admins, pero aquí lo dejamos para clientes)
router.post('/api/reservas', authMiddleware, roleMiddleware(['cliente', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, email, telefono, tipoBoleto, ruta, fecha } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!nombre || !email || !telefono || !tipoBoleto || !ruta || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!['Normal', 'VIP'].includes(tipoBoleto)) {
      return res.status(400).json({ error: 'tipoBoleto debe ser Normal o VIP' });
    }

    const nuevaReserva = new Reserva({
      nombre,
      email,
      telefono,
      tipoBoleto: tipoBoleto as TipoBoleto,
      ruta,
      fecha,
      userId
    });

    await repo.create(nuevaReserva);

    res.status(201).json({
      success: true,
      reserva: nuevaReserva.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al registrar' });
  }
});

// GET /api/reservas/todas - solo admin
router.get('/api/reservas/todas', authMiddleware, roleMiddleware(['admin']), async (_req: AuthRequest, res: Response) => {
  try {
    const reservas = await repo.findAll();
    res.json(reservas.map(r => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las reservas' });
  }
});

// GET /api/reservas/mis-reservas - clientes (y también admin puede ver las suyas, pero usamos rol)
router.get('/api/reservas/mis-reservas', authMiddleware, roleMiddleware(['cliente', 'admin', 'conductor']), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const reservas = await repo.findByUserId(userId);
    res.json(reservas.map(r => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Ejemplo de ruta para conductores (solo conductores)
router.get('/api/conductor/viajes', authMiddleware, roleMiddleware(['conductor']), (req: AuthRequest, res: Response) => {
  res.json({ mensaje: 'Ruta solo para conductores' });
});

export default router;