import { Persona } from './Persona';
import { EstadoConductor } from './Enums';
export class Conductor extends Persona {
    public estado: EstadoConductor = EstadoConductor.DISPONIBLE;
    constructor(id: number, nombre: string, telefono: string, public licencia: string) {
        super(id, nombre, telefono);
    }
}