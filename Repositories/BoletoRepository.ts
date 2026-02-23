// src/core/repositories/BoletoRepository.ts
import * as fs from 'fs-extra';
import { Boleto } from '../entities/Boleto';

export class BoletoRepository {
    private readonly filePath = './database.json';

    public async guardar(boleto: Boleto): Promise<void> {
        // 1. Leer lo que ya existe
        const data = await fs.readJson(this.filePath);
        
        // 2. Agregar el nuevo boleto (convertido a objeto simple)
        data.boletos.push({
            idBoleto: boleto.idBoleto,
            pasajero: boleto.reserva.pasajero.nombre,
            montoTotal: boleto.montoTotal,
            fecha: boleto.fechaEmision
        });

        // 3. Sobrescribir el archivo con la nueva información
        await fs.writeJson(this.filePath, data, { spaces: 2 });
        console.log("✅ Boleto guardado en el archivo JSON");
    }

    public async obtenerTodos(): Promise<any[]> {
        const data = await fs.readJson(this.filePath);
        return data.boletos;
    }
}