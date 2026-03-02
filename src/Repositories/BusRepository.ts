import fs from 'fs/promises';
import path from 'path';
import { Bus } from '../core/entities/Bus';

const DATA_PATH = path.join(process.cwd(), 'data/buses.json');

export class BusRepository {
  private static async readAll(): Promise<Bus[]> {
    try {
      const content = await fs.readFile(DATA_PATH, 'utf-8');
      const raw = JSON.parse(content || '[]');
      return raw.map((item: any) => new Bus(
        item.id,
        item.placa,
        item.capacidad,
        item.modelo
      ));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_PATH, '[]', 'utf-8');
        return [];
      }
      throw err;
    }
  }

  private static async writeAll(buses: Bus[]): Promise<void> {
    const json = buses.map(b => b.toJSON());
    await fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf-8');
  }

  async create(bus: Bus): Promise<Bus> {
    const all = await BusRepository.readAll();
    all.push(bus);
    await BusRepository.writeAll(all);
    return bus;
  }

  async findAll(): Promise<Bus[]> {
    return BusRepository.readAll();
  }

  async findById(id: number): Promise<Bus | null> {
    const all = await BusRepository.readAll();
    return all.find(b => b.id === id) || null;
  }

  async update(bus: Bus): Promise<void> {
    const all = await BusRepository.readAll();
    const index = all.findIndex(b => b.id === bus.id);
    if (index === -1) throw new Error('Bus no encontrado');
    all[index] = bus;
    await BusRepository.writeAll(all);
  }

  async delete(id: number): Promise<void> {
    const all = await BusRepository.readAll();
    const filtered = all.filter(b => b.id !== id);
    await BusRepository.writeAll(filtered);
  }
}