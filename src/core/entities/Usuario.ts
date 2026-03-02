export enum Rol {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
  CONDUCTOR = 'conductor'
}

export class Usuario {
  constructor(
    public id: number,
    public email: string,
    public passwordHash: string,
    public rol: Rol,
    public nombre?: string,
    public telefono?: string,
    public dni?: string,          // nuevo
    public licencia?: string       // nuevo
  ) {}

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      rol: this.rol,
      nombre: this.nombre,
      telefono: this.telefono,
      dni: this.dni,
      licencia: this.licencia
    };
  }
}