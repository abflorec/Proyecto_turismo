import express from 'express';
import path from 'path';
import { Pasajero } from './core/entities/Pasajero';
import { Reserva } from './core/entities/Reserva';
import { Boleto } from './core/entities/Boleto';
import { ServicioVIP } from './core/entities/ServicioVIP';
import { BoletoRepository } from '../Repositories/BoletoRepository';
import { EstadoReserva } from './core/entities/Enums';

const app = express();
const repo = new BoletoRepository();
app.use(express.json());

// Servir la carpeta frontend estáticamente
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/reservar', (req, res) => {
    const { nombre, dni, telefono, categoria } = req.body;

    try {
        // 1. Creamos al Pasajero (Herencia de Persona)
        const pasajero = new Pasajero(Math.floor(Math.random() * 1000), nombre, telefono, dni);

        // 2. Definimos el Servicio (Polimorfismo)
        const servicio = new ServicioVIP(1, "Servicio VIP", 100);
        const precioFinal = servicio.calcularPrecioBase();

        // 3. Creamos la Reserva y el Boleto
        const nuevaReserva = new Reserva(Date.now(), new Date(), pasajero);
        nuevaReserva.estado = EstadoReserva.CONFIRMADA;

        const nuevoBoleto = new Boleto(
            `BOL-${Math.floor(Math.random() * 9999)}`,
            precioFinal,
            new Date(),
            servicio
        );

        // 4. Guardamos en el JSON a través del Repositorio
        repo.guardar({
            reserva: nuevaReserva,
            boleto: nuevoBoleto,
            cliente: pasajero.nombre
        });

        res.status(200).json({ mensaje: "¡Reserva y Boleto generados!", detalle: nuevoBoleto });
    } catch (error) {
        res.status(500).json({ error: "Error en el sistema de transporte" });
    }
});

app.listen(3000, () => console.log("🚀 Sistema TipoServicioBus operativo en http://localhost:3000"));