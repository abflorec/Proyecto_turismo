// src/core/entities/TipoServicio.ts

export enum CategoriaServicio {
    ECONOMICO = "ECONOMICO",
    VIP = "VIP",
    TOUR_GUIADO = "TOUR_GUIADO"
}

export class TipoServicio {
    constructor(
        public readonly id: string,
        public readonly nombre: CategoriaServicio,
        public readonly factorPrecio: number, // Ej: 1.0 (Base), 1.5 (+50%)
        public readonly beneficios: string[]
    ) {}
}