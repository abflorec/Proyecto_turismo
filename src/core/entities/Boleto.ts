// src/core/entities/Boleto.ts
import { Reserva } from "./Reserva";
import { TipoServicio } from "./TipoServicio";

export class Boleto {
    public readonly fechaEmision: Date;
    public readonly montoTotal: number;

    constructor(
        public readonly idBoleto: string,
        public readonly reserva: Reserva,
        public readonly tipoServicio: TipoServicio
    ) {
        this.fechaEmision = new Date();
        this.montoTotal = this.calcularMonto();
    }

    private calcularMonto(): number {
        // Lógica: Precio base de la ruta x factor de servicio (VIP, etc)
        const precioBase = this.reserva.viaje.ruta.precioBase;
        return precioBase * this.tipoServicio.factorPrecio;
    }
}