const express = require('express');
const router = express.Router();
const PostgresUsuarioRepository = require('../../db/PostgresUsuarioRepository');
const IniciarSesion = require('../../../application/IniciarSesion');
const RegistrarUsuario = require('../../../application/RegistrarUsuario');
const authMiddleware = require('../middlewares/authMiddleware');

const usuarioRepo = new PostgresUsuarioRepository();
const iniciarSesionCasoUso = new IniciarSesion(usuarioRepo);
const registrarUsuarioCasoUso = new RegistrarUsuario(usuarioRepo);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await iniciarSesionCasoUso.ejecutar({ email, password });
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
});

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await registrarUsuarioCasoUso.ejecutar({ nombre, email, password, rol });
    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
});

// GET /api/auth/perfil (Protegido)
router.get('/perfil', authMiddleware, (req, res) => {
  return res.status(200).json({ usuario: req.usuario });
});

module.exports = router;
