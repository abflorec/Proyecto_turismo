import { Bus } from "./Bus";
import { RutaTuristica } from "./RutaTuristica";
import { Asiento } from "./Asiento";
import { EstadoAsiento, EstadoViaje } from "./Enums";
export class Viaje {
  private ocupacionAsientos: Map<number, EstadoAsiento> = new Map();
  public estado: EstadoViaje = EstadoViaje.PROGRAMADO;

  constructor(
    public readonly idViaje: string,
    public readonly ruta: RutaTuristica,
    public readonly bus: Bus,
    public readonly fechaHoraSalida: Date,
    public readonly conductorId: number   // nuevo
  ) {
    this.inicializarMapaAsientos();
  }

  private inicializarMapaAsientos(): void {
    // Asumiendo que bus.asientos es un array de Asiento con propiedad 'numero'
    this.bus.asientos.forEach(asiento => {
      this.ocupacionAsientos.set(asiento.numero, EstadoAsiento.LIBRE);
    });
  }

  public reservarAsiento(numeroAsiento: number): boolean {
    const estadoActual = this.ocupacionAsientos.get(numeroAsiento);
    if (estadoActual === EstadoAsiento.LIBRE) {
      this.ocupacionAsientos.set(numeroAsiento, EstadoAsiento.RESERVADO);
      return true;
    }
    return false;
  }

  public obtenerEstadoAsientos() {
    return Array.from(this.ocupacionAsientos.entries()).map(([numero, estado]) => ({
      numero,
      estado
    }));
  }

  public cancelarReserva(numeroAsiento: number): void {
    if (this.ocupacionAsientos.has(numeroAsiento)) {
      this.ocupacionAsientos.set(numeroAsiento, EstadoAsiento.LIBRE);
    }
  }

  // Método para convertir a JSON (para guardar)
  toJSON() {
    return {
      idViaje: this.idViaje,
      ruta: this.ruta.toJSON ? this.ruta.toJSON() : this.ruta,
      busId: this.bus.id,
      fechaHoraSalida: this.fechaHoraSalida.toISOString(),
      conductorId: this.conductorId,
      estado: this.estado,
      ocupacionAsientos: Array.from(this.ocupacionAsientos.entries())
    };
  }
}