import { TipoServicio } from './TipoServicio';
export class ServicioVIP extends TipoServicio {
    public kitBienvenida: boolean = true;
    calcularPrecioBase(): number {
        return this.precioBase * 1.5; // Recargo del 50% por ser VIP
    }
}