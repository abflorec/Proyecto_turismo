// src/core/entities/Reserva.ts
import { Pasajero } from "./Pasajero";
import { Viaje } from "./Viaje";

export enum EstadoReserva {
    RESERVADO = "RESERVADO",
    CONFIRMADO = "CONFIRMADO",
    CANCELADO = "CANCELADO"
}

export class Reserva {
    private estado: EstadoReserva;

    constructor(
        public readonly idReserva: string,
        public readonly pasajero: Pasajero,
        public readonly viaje: Viaje,
        public readonly numeroAsiento: number
    ) {
        this.estado = EstadoReserva.RESERVADO;
    }

    public confirmarReserva(): void {
        this.estado = EstadoReserva.CONFIRMADO;
    }

    public getEstado(): EstadoReserva {
        return this.estado;
    }
}