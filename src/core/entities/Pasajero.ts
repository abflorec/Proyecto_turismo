import { Persona } from './Persona';
export class Pasajero extends Persona {
    constructor(id: number, nombre: string, telefono: string, public dni: string) {
        super(id, nombre, telefono);
    }
}