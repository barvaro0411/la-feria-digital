const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/database');
const authRoutes = require('./rutas/authRoutes');
const codigosRoutes = require('./rutas/codigosRoutes');
const tiendasFisicasRoutes = require('./rutas/tiendasFisicasRoutes');
const comparadorRoutes = require('./rutas/comparadorRoutes');
const alertasRoutes = require('./rutas/alertasRoutes');

// ========== NUEVAS RUTAS FINANCIERAS ==========
const transaccionesRoutes = require('./rutas/transaccionesRoutes');
const metasRoutes = require('./rutas/metasRoutes');
const presupuestosRoutes = require('./rutas/presupuestosRoutes');

dotenv.config();

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/tiendas-fisicas', tiendasFisicasRoutes);
app.use('/api/comparador', comparadorRoutes);
app.use('/api/alertas', alertasRoutes);

// ========== NUEVAS RUTAS MONTADAS ==========
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/metas', metasRoutes);
app.use('/api/presupuestos', presupuestosRoutes);

app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API de La Feria Digital funcionando 👍',
        modulos: {
            cupones: '✅',
            finanzas: '✅ NUEVO',
            metas: '✅ NUEVO',
            presupuestos: '✅ NUEVO'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('🚀 Módulo financiero activado');
});
