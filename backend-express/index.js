const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuariosRouter = require('./routes/usuarios');
const rolesRouter = require('./routes/roles');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/usuarios', usuariosRouter);
app.use('/roles', rolesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Access Hub API - Backend Express',
    version: '1.0.0',
    endpoints: [
      'GET /usuarios',
      'GET /usuarios/:id',
      'GET /roles',
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});




