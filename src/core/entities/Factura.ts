// src/core/entities/Factura.ts
import { Boleto } from "./Boleto";
import { ServicioAdicional } from "./ServicioAdicional";

export class Factura {
    private serviciosExtra: ServicioAdicional[] = [];
    public readonly fechaEmision: Date = new Date();

    constructor(
        public readonly nroFactura: string,
        public readonly boleto: Boleto
    ) {}

    public agregarServicioExtra(servicio: ServicioAdicional): void {
        this.serviciosExtra.push(servicio);
    }

    /**
     * CORREGIDO: Ahora usa 'montoTotal' para coincidir con tu clase Boleto
     */
    public calcularTotal(): number {
        const totalExtras = this.serviciosExtra.reduce(
            (acumulado, s) => acumulado + s.precio, 
            0
        );
        // Usamos .montoTotal porque así lo definiste en Boleto.ts
        return this.boleto.montoTotal + totalExtras;
    }

    public obtenerResumen(): string {
        return `
        ===========================================
        FACTURA NRO: ${this.nroFactura}
        CLIENTE: ${this.boleto.reserva.pasajero.nombre}
        MONTO BOLETO: $${this.boleto.montoTotal}
        TOTAL FINAL: $${this.calcularTotal()}
        ===========================================
        `;
    }
}