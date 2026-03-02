import { Router, Request, Response } from 'express';
import { ReservaRepository } from '../Repositories/ReservaRepository';
import { Reserva, TipoBoleto } from '../core/entities/Reserva';

const router = Router();
const repo = new ReservaRepository();

router.post('/api/reservas', async (req: Request, res: Response) => {
  try {
    const { nombre, email, telefono, tipoBoleto, ruta, fecha } = req.body;

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
      fecha
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

// Opcional: ver todas (para pruebas)
router.get('/api/reservas', async (_req, res) => {
  try {
    const reservas = await repo.findAll();
    res.json(reservas.map(r => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las reservas' });
  }
});

export default router;