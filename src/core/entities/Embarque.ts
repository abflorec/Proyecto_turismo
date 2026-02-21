import { Boleto } from "./Boleto";

export enum EstadoEmbarque {
    RESERVADO = "RESERVADO",
    CONFIRMADO = "CONFIRMADO",
    ABORDADO = "ABORDADO",
    AUSENTE = "AUSENTE"
}

export class Embarque {
    private estado: EstadoEmbarque;

    constructor(
        public readonly idEmbarque: string,
        public readonly boleto: Boleto,
        public readonly fechaHora: Date = new Date()
    ) {
        // Al crearse el registro, el estado inicial es RESERVADO
        this.estado = EstadoEmbarque.RESERVADO;
    }

    public registrarAbordaje(): void {
        this.estado = EstadoEmbarque.ABORDADO;
    }

    public registrarAusencia(): void {
        this.estado = EstadoEmbarque.AUSENTE;
    }

    public getEstado(): EstadoEmbarque {
        return this.estado;
    }
}