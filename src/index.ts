import { Bus, TipoServicioBus } from "./core/entities/Bus";
import { RutaTuristica } from "./core/entities/RutaTuristica";
import { Viaje } from "./core/entities/Viaje";
import { Pasajero } from "./core/entities/Pasajero";
import { Reserva } from "./core/entities/Reserva";
import { TipoServicio, CategoriaServicio } from "./core/entities/TipoServicio";
import { Boleto } from "./core/entities/Boleto";
import { ServicioAdicional } from "./core/entities/ServicioAdicional";
import { Factura } from "./core/entities/Factura";
import { Embarque } from "./core/entities/Embarque";
// 1. Definir la Infraestructura
const miBus = new Bus("BUS-001", "Volvo B11R", 40, TipoServicioBus.VIP);
const rutaCusco = new RutaTuristica("R-01", "Tour Valle Sagrado", "Cusco", "Ollantaytambo", 5, 100);

// 2. Crear un Viaje (Para hoy mismo)
const viajeHoy = new Viaje("V-2024", rutaCusco, miBus, new Date());

// 3. Registrar un Pasajero
const cliente = new Pasajero("70605040", "Juan Pérez", "juan.perez@email.com");

// 4. Iniciar flujo de Reserva (Asiento 15)
console.log("--- Iniciando Reserva ---");
if (viajeHoy.reservarAsiento(15)) {
    const miReserva = new Reserva("RES-99", cliente, viajeHoy, 15);
    
    // 5. Definir el Servicio y emitir Boleto
    const servicioVip = new TipoServicio("S-VIP", CategoriaServicio.VIP, 1.5, ["Asiento reclinable", "Cena a bordo"]);
    const miBoleto = new Boleto("BOL-777", miReserva, servicioVip);

    // 6. Agregar Servicios Adicionales (Extras)
    const seguroViaje = new ServicioAdicional("EXT-01", "Seguro de Accidentes", 15);
    const tourGuiado = new ServicioAdicional("EXT-02", "Guía Bilingüe", 25);

    // 7. Generar Factura Final
    const miFactura = new Factura("FACT-001", miBoleto);
    miFactura.agregarServicioExtra(seguroViaje);
    miFactura.agregarServicioExtra(tourGuiado);

    // 8. Control de Salida (Embarque)
    const miEmbarque = new Embarque("EMB-01", miBoleto);
    miEmbarque.registrarAbordaje();

    // MOSTRAR RESULTADOS EN CONSOLA
    console.log(miFactura.obtenerResumen());
    console.log(`Estado del pasajero: ${miEmbarque.getEstado()}`);
    console.log(`Monto base del boleto (con factor VIP): $${miBoleto.montoTotal}`);
    console.log(`Total con extras: $${miFactura.calcularTotal()}`);
} else {
    console.log("Error: El asiento ya está ocupado.");
}