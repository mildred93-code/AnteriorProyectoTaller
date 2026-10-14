const bcrypt = require('bcryptjs');

class Usuario {
  constructor({ id, nombre, email, password, rol = 'usuario', creadoEn = new Date() }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.creadoEn = creadoEn;
  }

  async compararPassword(passwordPlano) {
    if (!this.password) return false;
    return await bcrypt.compare(passwordPlano, this.password);
  }

  static async hashearPassword(passwordPlano) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(passwordPlano, salt);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      creadoEn: this.creadoEn,
    };
  }
}

module.exports = Usuario;
