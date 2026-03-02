import fs from 'fs/promises';
import path from 'path';
import { Reserva } from '../core/entities/Reserva';

const DATA_PATH = path.join(process.cwd(), 'data/reservas.json');

export class ReservaRepository {
  private static async readAll(): Promise<Reserva[]> {
    try {
      const content = await fs.readFile(DATA_PATH, 'utf-8');
      const raw = JSON.parse(content || '[]');
      return raw.map((item: any) => new Reserva({
        id: item.id,
        nombre: item.pasajero.nombre,
        email: item.pasajero.email,
        telefono: item.pasajero.telefono,
        tipoBoleto: item.tipoBoleto,
        ruta: item.ruta,
        fecha: item.fecha
      }));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_PATH, '[]', 'utf-8');
        return [];
      }
      throw err;
    }
  }

  private static async writeAll(reservas: Reserva[]): Promise<void> {
    const json = reservas.map(r => r.toJSON());
    await fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf-8');
  }

  async create(reserva: Reserva): Promise<Reserva> {
    const all = await ReservaRepository.readAll();
    all.push(reserva);
    await ReservaRepository.writeAll(all);
    return reserva;
  }

  async findAll(): Promise<Reserva[]> {
    return ReservaRepository.readAll();
  }
}