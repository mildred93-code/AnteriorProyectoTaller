const jwt = require('jsonwebtoken');

class IniciarSesion {
  constructor(usuarioRepository, jwtSecret = process.env.JWT_SECRET || 'secreto_super_seguro_farmacia') {
    this.usuarioRepository = usuarioRepository;
    this.jwtSecret = jwtSecret;
  }

  async ejecutar({ email, password }) {
    if (!email || !password) {
      throw new Error('El email y la contraseña son obligatorios');
    }

    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    const esPasswordValido = await usuario.compararPassword(password);
    if (!esPasswordValido) {
      throw new Error('Credenciales inválidas');
    }

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '8h' });

    return {
      token,
      usuario: usuario.toJSON(),
    };
  }
}

module.exports = IniciarSesion;
