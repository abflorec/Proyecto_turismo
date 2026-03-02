// src/server.ts
import express from 'express';
import path from 'path';
import publicRoutes from './routes/publicRoutes';

console.log('Ruta absoluta del JSON:', path.resolve(process.cwd(), 'data/reservas.json'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend
app.use(express.static(path.join(process.cwd(), 'frontend')));

// Rutas API
app.use('/', publicRoutes);  // o '/api' si prefieres prefijo

// Ruta raíz → frontend
app.get('/', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/index.html'));
});

// Ruta wildcard para SPA / fallback 404 → versión Express 5
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo → http://localhost:${PORT}`);
});