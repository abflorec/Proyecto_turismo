export class RutaTuristica {
    private paradas: string[] = [];

    constructor(
        public readonly idRuta: string,
        public readonly nombre: string, // Ej: "Ruta del Pisco" o "City Tour Histórico"
        public readonly origen: string,
        public readonly destino: string,
        public readonly duracionEstimadaHoras: number,
        public readonly precioBase: number
    ) {}

    /**
     * Permite añadir puntos de interés o escalas técnicas a la ruta.
     */
    public agregarParada(nombreParada: string): void {
        this.paradas.push(nombreParada);
    }

    public getParadas(): string[] {
        // Retornamos una copia para proteger la integridad del array original (Encapsulamiento)
        return [...this.paradas];
    }

    /**
     * Retorna una descripción resumida de la ruta.
     */
    public obtenerResumen(): string {
        return `${this.nombre} (${this.origen} -> ${this.destino}) - Duración: ${this.duracionEstimadaHoras}h`;
    }
}