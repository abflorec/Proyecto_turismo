import { EstadoBus } from './Enums';
import { Asiento } from './Asiento';

export class Bus {
    public asientos: Asiento[] = [];
    public estado: EstadoBus = EstadoBus.ACTIVO;

    constructor(
        public id: number, 
        public placa: string, 
        public capacidad: number, 
        public modelo: string
    ) {
        // Composición: El bus crea sus propios asientos
        for (let i = 1; i <= capacidad; i++) {
            this.asientos.push(new Asiento(i));
        }
    }
}