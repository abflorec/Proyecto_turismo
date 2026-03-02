import { Pasajero } from './Pasajero';

export type TipoBoleto = 'Normal' | 'VIP';

export class Reserva {
  public id: number;
  public pasajero: Pasajero;
  public tipoBoleto: TipoBoleto;
  public ruta: string;
  public fecha: string;           // "2025-04-15"
  public fechaRegistro: string;   // ISO

  constructor(data: {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    tipoBoleto: TipoBoleto;
    ruta: string;
    fecha: string;
  }) {
    this.id = data.id ?? Date.now();
    this.pasajero = new Pasajero(data.nombre, data.email, data.telefono);
    this.tipoBoleto = data.tipoBoleto;
    this.ruta = data.ruta;
    this.fecha = data.fecha;
    this.fechaRegistro = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      pasajero: this.pasajero.toJSON(),
      tipoBoleto: this.tipoBoleto,
      ruta: this.ruta,
      fecha: this.fecha,
      fechaRegistro: this.fechaRegistro
    };
  }
}