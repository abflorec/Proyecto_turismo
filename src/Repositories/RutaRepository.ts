import fs from 'fs/promises';
import path from 'path';
import { RutaTuristica } from '../core/entities/RutaTuristica';

const DATA_PATH = path.join(process.cwd(), 'data/rutas.json');

export class RutaRepository {
  private static async readAll(): Promise<RutaTuristica[]> {
    try {
      const content = await fs.readFile(DATA_PATH, 'utf-8');
      const raw = JSON.parse(content || '[]');
      return raw.map((item: any) => {
        const ruta = new RutaTuristica(
          item.idRuta,
          item.nombre,
          item.origen,
          item.destino,
          item.duracionEstimadaHoras,
          item.precioBase
        );
        // Restaurar paradas si existen
        if (item.paradas && Array.isArray(item.paradas)) {
          item.paradas.forEach((p: string) => ruta.agregarParada(p));
        }
        return ruta;
      });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_PATH, '[]', 'utf-8');
        return [];
      }
      throw err;
    }
  }

  private static async writeAll(rutas: RutaTuristica[]): Promise<void> {
    const json = rutas.map(r => r.toJSON());
    await fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf-8');
  }

  async create(ruta: RutaTuristica): Promise<RutaTuristica> {
    const all = await RutaRepository.readAll();
    // Verificar si ya existe una ruta con el mismo id
    const existe = all.find(r => r.idRuta === ruta.idRuta);
    if (existe) {
      throw new Error('Ya existe una ruta con ese ID');
    }
    all.push(ruta);
    await RutaRepository.writeAll(all);
    return ruta;
  }

  async findAll(): Promise<RutaTuristica[]> {
    return RutaRepository.readAll();
  }

  async findById(idRuta: string): Promise<RutaTuristica | null> {
    const all = await RutaRepository.readAll();
    return all.find(r => r.idRuta === idRuta) || null;
  }

  async update(ruta: RutaTuristica): Promise<void> {
    const all = await RutaRepository.readAll();
    const index = all.findIndex(r => r.idRuta === ruta.idRuta);
    if (index === -1) throw new Error('Ruta no encontrada');
    all[index] = ruta;
    await RutaRepository.writeAll(all);
  }

  async delete(idRuta: string): Promise<void> {
    const all = await RutaRepository.readAll();
    const filtered = all.filter(r => r.idRuta !== idRuta);
    await RutaRepository.writeAll(filtered);
  }
}