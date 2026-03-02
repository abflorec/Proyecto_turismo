// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import reservaRoutes from './routes/reservaRoutes';
import adminRoutes from './routes/adminRoutes';        // <-- importar
import conductorRoutes from './routes/conductorRoutes'; // <-- importar

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend
app.use(express.static(path.join(process.cwd(), 'frontend')));

// Rutas API (orden: primero las rutas específicas)
app.use('/', authRoutes);          // /auth/register, /auth/login
app.use('/', reservaRoutes);        // /api/reservas, etc.
app.use('/', adminRoutes);          // /admin/...
app.use('/', conductorRoutes);      // /conductor/...

// Ruta raíz → frontend
app.get('/', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/index.html'));
});

// Ruta wildcard para SPA (Express 5) – debe ir al final
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo → http://localhost:${PORT}`);
});