import * as fs from 'fs';
import * as path from 'path';

export class BoletoRepository {
    private filePath = path.join(__dirname, '../../../database.json');

    guardar(datos: any) {
        const bd = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        bd.boletos.push(datos);
        fs.writeFileSync(this.filePath, JSON.stringify(bd, null, 2));
    }

    obtenerTodos() {
        const bd = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        return bd.boletos;
    }
}