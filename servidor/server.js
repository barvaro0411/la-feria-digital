// CÓDIGO ACTUALIZADO para: servidor/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/database');
const authRoutes = require('./rutas/authRoutes');
const codigosRoutes = require('./rutas/codigosRoutes');
const tiendasFisicasRoutes = require('./rutas/tiendasFisicasRoutes');
const comparadorRoutes = require('./rutas/comparadorRoutes');
const alertasRoutes = require('./rutas/alertasRoutes'); // <--- NUEVO

// 1. Cargar variables de entorno
dotenv.config();

// 2. Inicializar la aplicación Express
const app = express();

// 3. Conectar a MongoDB
conectarDB();

// 4. Middlewares
app.use(cors());
app.use(express.json());

// 5. Montar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/tiendas-fisicas', tiendasFisicasRoutes);
app.use('/api/comparador', comparadorRoutes);
app.use('/api/alertas', alertasRoutes); // <--- NUEVA RUTA MONTADA

// Ruta demo para probar
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de La Feria Digital funcionando 👍' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});