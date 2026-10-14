const pool = require('../../config/db');
const Usuario = require('../../domain/entities/Usuario');
const UsuarioRepository = require('../../ports/UsuarioRepository');

class PostgresUsuarioRepository extends UsuarioRepository {
  async buscarPorEmail(email) {
    const query = 'SELECT id, nombre, email, password, rol, creado_en FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Usuario({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password: row.password,
      rol: row.rol,
      creadoEn: row.creado_en,
    });
  }

  async buscarPorId(id) {
    const query = 'SELECT id, nombre, email, password, rol, creado_en FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Usuario({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password: row.password,
      rol: row.rol,
      creadoEn: row.creado_en,
    });
  }

  async guardar(usuario) {
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, password, rol, creado_en
    `;
    const values = [usuario.nombre, usuario.email, usuario.password, usuario.rol || 'usuario'];
    const result = await pool.query(query, values);
    const row = result.rows[0];

    return new Usuario({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password: row.password,
      rol: row.rol,
      creadoEn: row.creado_en,
    });
  }
}

module.exports = PostgresUsuarioRepository;
