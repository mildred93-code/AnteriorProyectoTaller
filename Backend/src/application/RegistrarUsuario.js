const Usuario = require('../domain/entities/Usuario');

class RegistrarUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ nombre, email, password, rol = 'usuario' }) {
    if (!nombre || !email || !password) {
      throw new Error('El nombre, email y contraseña son obligatorios');
    }

    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('El usuario ya existe con este email');
    }

    const passwordHash = await Usuario.hashearPassword(password);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol,
    });

    const usuarioGuardado = await this.usuarioRepository.guardar(nuevoUsuario);
    return usuarioGuardado.toJSON();
  }
}

module.exports = RegistrarUsuario;
