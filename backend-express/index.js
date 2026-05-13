const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuariosRouter = require('./routes/usuarios');
const rolesRouter = require('./routes/roles');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const verifyToken = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', authRouter);

// Rutas protegidas — usadas por el frontend Angular
app.use('/users', verifyToken, usersRouter);

// Rutas legacy (sprint anterior)
app.use('/usuarios', verifyToken, usuariosRouter);
app.use('/roles', verifyToken, rolesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Access Hub API - Backend Express',
    version: '3.0.0',
    endpoints: {
      publicos: [
        'POST /auth/register',
        'POST /auth/login',
      ],
      protegidos: [
        'GET    /users              (lista con paginación, búsqueda y filtro)',
        'GET    /users/:id',
        'POST   /users',
        'PATCH  /users/:id',
        'PATCH  /users/:id/password',
        'DELETE /users/:id',
        'GET    /roles',
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});