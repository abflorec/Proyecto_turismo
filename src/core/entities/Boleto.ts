import { TipoServicio } from './TipoServicio';

export class Boleto {
    constructor(
        public codigo: string,
        public precio: number,
        public fechaEmision: Date,
        public tipoServicio: TipoServicio
    ) {}
}