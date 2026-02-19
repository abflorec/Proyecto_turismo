import { Asiento, EstadoAsiento } from "./Asiento";

export enum TipoServicioBus {
    ECONOMICO = "ECONOMICO",
    VIP = "VIP"
}

export class Bus {
    private asientos: Asiento[] = [];

    constructor(
        public readonly placa: string,
        public readonly modelo: string,
        public readonly capacidad: number,
        public readonly tipoServicio: TipoServicioBus
    ) {
        this.generarAsientos();
    }

    private generarAsientos(): void {
        for (let i = 1; i <= this.capacidad; i++) {
            // Lógica simple: si tiene más de 40 asientos, los primeros 20 son piso 1, resto piso 2
            const piso = i <= 20 ? 1 : 2;
            this.asientos.push(new Asiento(i, piso));
        }
    }

    public getAsientos(): Asiento[] {
        return this.asientos;
    }

    public buscarAsiento(numero: number): Asiento | undefined {
        return this.asientos.find(a => a.numero === numero);
    }
    
    public obtenerDisponibilidad(): number {
        return this.asientos.filter(a => a.estaLibre()).length;
    }
}