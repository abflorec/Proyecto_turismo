export class RutaTuristica {
  private paradas: string[] = [];

  constructor(
    public readonly idRuta: string,
    public nombre: string,
    public origen: string,
    public destino: string,
    public duracionEstimadaHoras: number,
    public precioBase: number
  ) {}

  public agregarParada(nombreParada: string): void {
    this.paradas.push(nombreParada);
  }

  public setParadas(nuevasParadas: string[]): void {
    this.paradas = [...nuevasParadas];
  }

  public getParadas(): string[] {
    return [...this.paradas];
  }

  public obtenerResumen(): string {
    return `${this.nombre} (${this.origen} -> ${this.destino}) - Duración: ${this.duracionEstimadaHoras}h`;
  }

  toJSON() {
    return {
      idRuta: this.idRuta,
      nombre: this.nombre,
      origen: this.origen,
      destino: this.destino,
      duracionEstimadaHoras: this.duracionEstimadaHoras,
      precioBase: this.precioBase,
      paradas: this.paradas
    };
  }
}