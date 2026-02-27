export abstract class TipoServicio {
    constructor(
        public id: number,
        public nombre: string,
        public precioBase: number
    ) {}
    abstract calcularPrecioBase(): number;
}