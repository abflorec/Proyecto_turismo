import { Pasajero } from './Pasajero';
import { EstadoReserva } from './Enums';

export class Reserva {
    public estado: EstadoReserva = EstadoReserva.PENDIENTE;
    constructor(
        public id: number,
        public fechaReserva: Date,
        public pasajero: Pasajero
    ) {}
}