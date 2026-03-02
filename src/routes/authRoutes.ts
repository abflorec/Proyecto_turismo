import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../Repositories/UsuarioRepository';
import { Usuario, Rol } from '../core/entities/Usuario';

const router = Router();
const userRepo = new UsuarioRepository();

// Registro
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, telefono } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const existe = await userRepo.findByEmail(email);
    if (existe) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = new Usuario(
      Date.now(),
      email,
      passwordHash,
      Rol.CLIENTE,
      nombre,
      telefono
    );

    await userRepo.create(nuevoUsuario);

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: nuevoUsuario.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const usuario = await userRepo.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: usuario.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;