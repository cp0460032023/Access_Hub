const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET /users — Listar usuarios con paginación, búsqueda y filtro por rol
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, role, "createdAt" FROM users WHERE "deletedAt" IS NULL';
    let countQuery = 'SELECT COUNT(*) FROM users WHERE "deletedAt" IS NULL';
    const params = [];
    const countParams = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      countQuery += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      query += ` AND role = $${paramIndex}`;
      countQuery += ` AND role = $${paramIndex}`;
      params.push(role);
      countParams.push(role);
      paramIndex++;
    }

    query += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({ data: result.rows, total, page, limit });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// GET /users/:id — Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, role, "createdAt" FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// POST /users — Crear nuevo usuario (solo admin)
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  const requestingUser = req.user;

  if (requestingUser.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permiso para crear usuarios.' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, "createdAt"',
      [name, email, hashedPassword, role || 'viewer']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// PATCH /users/:id — Actualizar usuario
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const requestingUser = req.user;

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Solo admin puede cambiar roles
    if (role && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para cambiar roles.' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email); }
    if (role && requestingUser.role === 'admin') {
      fields.push(`role = $${idx++}`);
      values.push(role);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar.' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, role, "createdAt"`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// PATCH /users/:id/password — Cambiar contraseña
router.patch('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  const requestingUser = req.user;

  // Solo el mismo usuario o admin puede cambiar contraseña
  if (requestingUser.sub !== id && requestingUser.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permiso para cambiar esta contraseña.' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Contraseña actual y nueva son requeridas.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// DELETE /users/:id — Soft delete (solo admin)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const requestingUser = req.user;

  if (requestingUser.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permiso para eliminar usuarios.' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await pool.query('UPDATE users SET "deletedAt" = NOW() WHERE id = $1', [id]);

    res.json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;