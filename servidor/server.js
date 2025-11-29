const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/database');

const authRoutes = require('./rutas/authRoutes');
const codigosRoutes = require('./rutas/codigosRoutes');
const tiendasFisicasRoutes = require('./rutas/tiendasFisicasRoutes');
const comparadorRoutes = require('./rutas/comparadorRoutes');
const alertasRoutes = require('./rutas/alertasRoutes');
const eventosRoutes = require('./rutas/eventosRoutes');

// ========== RUTAS FINANCIERAS ==========
const transaccionesRoutes = require('./rutas/transaccionesRoutes');
const metasRoutes = require('./rutas/metasRoutes');
const presupuestosRoutes = require('./rutas/presupuestosRoutes');
const chatRoutes = require('./rutas/chatRoutes');

dotenv.config();

const app = express();

conectarDB();

// CORS configurado para producción y desarrollo
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/tiendas-fisicas', tiendasFisicasRoutes);
app.use('/api/comparador', comparadorRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/eventos', eventosRoutes);

// ========== RUTAS FINANCIERAS MONTADAS ==========
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/metas', metasRoutes);
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de NubiAI funcionando 👍',
    modulos: {
      cupones: '✅',
      finanzas: '✅',
      metas: '✅',
      presupuestos: '✅',
      chatIA: '✅'
    }
  });
});

// Puerto para Vercel y desarrollo local
const PORT = process.env.PORT || 3000;

// Iniciar servidor (funciona en desarrollo y producción local)
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log('💰 Módulo financiero activado');
  console.log('🤖 Chat IA de Nubi activado');
});

// Exportar para Vercel (serverless)
module.exports = app;
