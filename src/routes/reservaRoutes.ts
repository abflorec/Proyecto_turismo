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

// ========== NUEVA RUTA: DELETE /api/reservas/:id - Eliminar una reserva ==========
router.delete('/api/reservas/:id', authMiddleware, roleMiddleware(['cliente', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    // Manejar el parámetro ID correctamente
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const reservaId = parseInt(idParam);
    if (isNaN(reservaId)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }
    
    const userId = req.user?.id;
    const userRole = req.user?.rol;
    
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Obtener todas las reservas
    const reservas = await repo.findAll();
    
    // Buscar la reserva
    const reserva = reservas.find(r => r.id === reservaId);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar permisos: admin puede eliminar cualquier reserva, cliente solo las suyas
    if (userRole !== 'admin' && reserva.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta reserva' });
    }

    // Eliminar la reserva (necesitamos implementar delete en el repositorio)
    // Por ahora, filtramos y guardamos
    const reservasActualizadas = reservas.filter(r => r.id !== reservaId);
    
    // Aquí necesitamos guardar el array actualizado
    // Como no tenemos método delete en el repo, necesitamos acceder al método writeAll
    // Esto es un workaround - idealmente deberías implementar delete en ReservaRepository
    const fs = require('fs');
    const path = require('path');
    const DATA_PATH = path.join(process.cwd(), 'data/reservas.json');
    
    const json = reservasActualizadas.map(r => r.toJSON());
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf-8');
    
    res.json({ 
      success: true, 
      message: 'Reserva cancelada exitosamente' 
    });
    
  } catch (err) {
    console.error('Error al cancelar reserva:', err);
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

// ========== RUTA PARA COMPRAR BOLETO (simulada) ==========
router.post('/api/reservas/:id/comprar', authMiddleware, roleMiddleware(['cliente', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const reservaId = parseInt(idParam);
    if (isNaN(reservaId)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }
    
    const userId = req.user?.id;
    const userRole = req.user?.rol;
    
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const reservas = await repo.findAll();
    const reserva = reservas.find(r => r.id === reservaId);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    if (userRole !== 'admin' && reserva.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para comprar esta reserva' });
    }

    // Aquí iría la lógica de pago real
    // Por ahora, simulamos una compra exitosa
    
    res.json({ 
      success: true, 
      message: 'Boleto comprado exitosamente',
      boleto: {
        reservaId: reserva.id,
        codigo: `BOL-${Date.now()}`,
        fecha: new Date().toISOString(),
        total: reserva.tipoBoleto === 'VIP' ? 150 : 100 // Precio simulado
      }
    });
    
  } catch (err) {
    console.error('Error al comprar boleto:', err);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

// Ejemplo de ruta para conductores (solo conductores)
router.get('/api/conductor/viajes', authMiddleware, roleMiddleware(['conductor']), (req: AuthRequest, res: Response) => {
  res.json({ mensaje: 'Ruta solo para conductores' });
});

export default router;