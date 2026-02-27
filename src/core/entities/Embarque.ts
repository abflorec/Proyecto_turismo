import { Boleto } from './Boleto';
import { EstadoEmbarque } from './Enums';

export class Embarque {
    constructor(
        public id: number,
        public horaEmbarque: string,
        public estado: EstadoEmbarque = EstadoEmbarque.PENDIENTE,
        public boleto: Boleto
    ) {}

    public validarBoleto(): boolean {
        // Lógica: Si el boleto tiene código, es válido para embarcar
        return this.boleto.codigo !== "";
    }

    public registrarEmbarque(): void {
        if (this.validarBoleto()) {
            this.estado = EstadoEmbarque.REALIZADO;
            console.log(`Embarque ${this.id} realizado con éxito.`);
        } else {
            console.log("Error: Boleto no válido.");
        }
    }
}