import fs from 'fs/promises';
import path from 'path';
import { Usuario, Rol } from '../core/entities/Usuario';

const DATA_PATH = path.join(process.cwd(), 'data/usuarios.json');

export class UsuarioRepository {
  private static async readAll(): Promise<Usuario[]> {
    try {
      const content = await fs.readFile(DATA_PATH, 'utf-8');
      const raw = JSON.parse(content || '[]');
      return raw.map((item: any) => new Usuario(
        item.id,
        item.email,
        item.passwordHash,
        item.rol as Rol,
        item.nombre,
        item.telefono,
        item.dni,
        item.licencia
      ));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(DATA_PATH, '[]', 'utf-8');
        return [];
      }
      throw err;
    }
  }

  private static async writeAll(usuarios: Usuario[]): Promise<void> {
    const json = usuarios.map(u => ({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      rol: u.rol,
      nombre: u.nombre,
      telefono: u.telefono,
      dni: u.dni,
      licencia: u.licencia
    }));
    await fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf-8');
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const all = await UsuarioRepository.readAll();
    const existe = all.find(u => u.email === usuario.email);
    if (existe) {
      throw new Error('Ya existe un usuario con ese email');
    }
    all.push(usuario);
    await UsuarioRepository.writeAll(all);
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const all = await UsuarioRepository.readAll();
    return all.find(u => u.email === email) || null;
  }

  async findById(id: number): Promise<Usuario | null> {
    const all = await UsuarioRepository.readAll();
    return all.find(u => u.id === id) || null;
  }

  async findAll(): Promise<Usuario[]> {
    return UsuarioRepository.readAll();
  }

  async update(usuario: Usuario): Promise<void> {
    const all = await UsuarioRepository.readAll();
    const index = all.findIndex(u => u.id === usuario.id);
    if (index === -1) throw new Error('Usuario no encontrado');
    all[index] = usuario;
    await UsuarioRepository.writeAll(all);
  }

  async delete(id: number): Promise<void> {
    const all = await UsuarioRepository.readAll();
    const filtered = all.filter(u => u.id !== id);
    await UsuarioRepository.writeAll(filtered);
  }
}