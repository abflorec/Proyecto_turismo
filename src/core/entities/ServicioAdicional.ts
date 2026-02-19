// src/core/entities/ServicioAdicional.ts

export class ServicioAdicional {
    constructor(
        public readonly id: string,
        public readonly nombre: string,
        public readonly precio: number
    ) {}
}