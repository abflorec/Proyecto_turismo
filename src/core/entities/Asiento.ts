
export enum EstadoAsiento {
    DISPONIBLE = "DISPONIBLE",
    RESERVADO = "RESERVADO",
    OCUPADO = "OCUPADO"
}

export class Asiento {
    constructor(
        public readonly numero: number,
        public readonly piso: number,
        private estado: EstadoAsiento = EstadoAsiento.DISPONIBLE
    ) {}

    public getEstado(): EstadoAsiento {
        return this.estado;
    }

    public cambiarEstado(nuevoEstado: EstadoAsiento): void {
        this.estado = nuevoEstado;
    }

    public estaLibre(): boolean {
        return this.estado === EstadoAsiento.DISPONIBLE;
    }
}