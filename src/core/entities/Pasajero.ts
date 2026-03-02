export class Pasajero {
  constructor(
    public nombre: string,
    public email: string,
    public telefono: string,
    public dni?: string          // opcional por ahora
  ) {}

  toJSON() {
    return {
      nombre: this.nombre.trim(),
      email: this.email.trim(),
      telefono: this.telefono.trim(),
      ...(this.dni && { dni: this.dni.trim() })
    };
  }
}