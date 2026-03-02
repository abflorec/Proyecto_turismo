const fs = require('fs');
const path = require('path');

const files = ['buses.json', 'rutas.json', 'viajes.json', 'reservas.json', 'usuarios.json'];
files.forEach(file => {
  const filePath = path.join(__dirname, 'data', file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  // Eliminar BOM si existe
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.substring(1);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`BOM eliminado de ${file}`);
  }
});