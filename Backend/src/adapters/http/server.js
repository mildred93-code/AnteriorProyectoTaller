const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const lotesRoutes = require('./routes/lotes.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/lotes', lotesRoutes);

// Ruta de verificación de estado
app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'Servidor ejecutándose correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor HTTP iniciado en http://localhost:${PORT}`);
});

module.exports = app;
