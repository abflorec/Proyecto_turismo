// src/core/entities/Pasajero.ts

export class Pasajero {
    constructor(
        public readonly dni: string,
        public readonly nombre: string,
        public readonly email: string
    ) {}
}