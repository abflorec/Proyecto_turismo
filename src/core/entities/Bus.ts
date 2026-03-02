import { EstadoBus } from './Enums';
import { Asiento } from './Asiento';

export class Bus {
  public asientos: Asiento[] = [];
  public estado: EstadoBus = EstadoBus.ACTIVO;

  constructor(
    public id: number,
    public placa: string,
    public capacidad: number,
    public modelo: string
  ) {
    for (let i = 1; i <= capacidad; i++) {
      this.asientos.push(new Asiento(i));
    }
  }

  // Para guardar en JSON
  toJSON() {
    return {
      id: this.id,
      placa: this.placa,
      capacidad: this.capacidad,
      modelo: this.modelo,
      estado: this.estado
    };
  }
}