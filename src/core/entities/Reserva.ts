import { Pasajero } from './Pasajero';

export type TipoBoleto = 'Normal' | 'VIP';

export class Reserva {
  public id: number;
  public pasajero: Pasajero;
  public tipoBoleto: TipoBoleto;
  public ruta: string;
  public fecha: string;
  public fechaRegistro: string;
  public userId: number;   // <-- NUEVO

  constructor(data: {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    tipoBoleto: TipoBoleto;
    ruta: string;
    fecha: string;
    userId: number;
  }) {
    this.id = data.id ?? Date.now();
    this.pasajero = new Pasajero(data.nombre, data.email, data.telefono);
    this.tipoBoleto = data.tipoBoleto;
    this.ruta = data.ruta;
    this.fecha = data.fecha;
    this.fechaRegistro = new Date().toISOString();
    this.userId = data.userId;
  }

  toJSON() {
    return {
      id: this.id,
      pasajero: this.pasajero.toJSON(),
      tipoBoleto: this.tipoBoleto,
      ruta: this.ruta,
      fecha: this.fecha,
      fechaRegistro: this.fechaRegistro,
      userId: this.userId
    };
  }
}