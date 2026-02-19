export interface PuntoControl {
    lugar: string;
    horaEstimada: Date;
    esParadaPrincipal: boolean;
}

export class Itinerario {
    private puntos: PuntoControl[] = [];

    constructor(
        public readonly idItinerario: string,
        public readonly descripcion: string
    ) {}

    /**
     * Agrega un hito horario al recorrido del bus.
     */
    public agregarPuntoControl(lugar: string, horasDesdeSalida: number, esParadaPrincipal: boolean = false): void {
        const horaEstimada = new Date(); 
        // Lógica simple para simular el avance del tiempo en el itinerario
        horaEstimada.setHours(horaEstimada.getHours() + horasDesdeSalida);

        this.puntos.push({
            lugar,
            horaEstimada,
            esParadaPrincipal
        });
    }

    /**
     * Devuelve la lista de paradas ordenada cronológicamente.
     */
    public obtenerCronograma(): PuntoControl[] {
        return [...this.puntos].sort((a, b) => a.horaEstimada.getTime() - b.horaEstimada.getTime());
    }

    /**
     * Filtra solo las paradas donde los pasajeros pueden subir o bajar.
     */
    public obtenerParadasPrincipales(): PuntoControl[] {
        return this.puntos.filter(p => p.esParadaPrincipal);
    }
}