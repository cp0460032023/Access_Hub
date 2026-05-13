const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET /roles — Listar roles disponibles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT role, COUNT(*) as total_usuarios FROM users WHERE "deletedAt" IS NULL GROUP BY role ORDER BY role'
    );
    res.json({
      message: 'Roles obtenidos exitosamente',
      data: [
        { role: 'admin', descripcion: 'Acceso total al sistema' },
        { role: 'editor', descripcion: 'Puede leer y editar usuarios' },
        { role: 'viewer', descripcion: 'Solo puede ver su perfil' },
      ],
      estadisticas: result.rows
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;