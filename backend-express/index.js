const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuariosRouter = require('./routes/usuarios');
const rolesRouter = require('./routes/roles');
const authRouter = require('./routes/auth');
const verifyToken = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', authRouter);

// Rutas protegidas
app.use('/usuarios', verifyToken, usuariosRouter);
app.use('/roles', verifyToken, rolesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Access Hub API - Backend Express',
    version: '2.0.0',
    endpoints: {
      publicos: [
        'POST /auth/register',
        'POST /auth/login',
      ],
      protegidos: [
        'GET /usuarios        (requiere token)',
        'GET /usuarios/:id    (requiere token)',
        'GET /roles           (requiere token)',
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});