import { Bus } from "./Bus";
import { RutaTuristica } from "./RutaTuristica";
import { Asiento, EstadoAsiento } from "./Asiento";

export class Viaje {
    // Diccionario para acceso rápido: key = numeroAsiento, value = Estado
    private ocupacionAsientos: Map<number, EstadoAsiento> = new Map();

    constructor(
        public readonly idViaje: string,
        public readonly ruta: RutaTuristica,
        public readonly bus: Bus,
        public readonly fechaHoraSalida: Date
    ) {
        this.inicializarMapaAsientos();
    }

    /**
     * Sincroniza el estado inicial de los asientos basándose en el Bus asignado.
     */
    private inicializarMapaAsientos(): void {
        this.bus.getAsientos().forEach(asiento => {
            this.ocupacionAsientos.set(asiento.numero, EstadoAsiento.DISPONIBLE);
        });
    }

    /**
     * LÓGICA CRÍTICA: Verifica y bloquea un asiento en una sola operación (Atomicidad lógica).
     * Esto cumple con el requisito de "sincronización en tiempo real".
     */
    public reservarAsiento(numeroAsiento: number): boolean {
        const estadoActual = this.ocupacionAsientos.get(numeroAsiento);

        if (estadoActual === EstadoAsiento.DISPONIBLE) {
            this.ocupacionAsientos.set(numeroAsiento, EstadoAsiento.RESERVADO);
            return true;
        }
        return false; // El asiento ya no está disponible
    }

    /**
     * Retorna la lista de asientos con su estado actual para este viaje específico.
     */
    public obtenerEstadoActualAsientos() {
        return Array.from(this.ocupacionAsientos.entries()).map(([numero, estado]) => ({
            numero,
            estado
        }));
    }

    public cancelarReservaAsiento(numeroAsiento: number): void {
        if (this.ocupacionAsientos.has(numeroAsiento)) {
            this.ocupacionAsientos.set(numeroAsiento, EstadoAsiento.DISPONIBLE);
        }
    }
}