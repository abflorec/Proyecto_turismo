import { EstadoAsiento } from './Enums';
export class Asiento {
    public estado: EstadoAsiento = EstadoAsiento.LIBRE;
    constructor(public numero: number) {}
}