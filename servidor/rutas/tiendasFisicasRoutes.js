// CÓDIGO para el NUEVO ARCHIVO: servidor/rutas/tiendasFisicasRoutes.js

const express = require('express');
const router = express.Router();
const tiendasFisicasController = require('../controladores/tiendasFisicasController');
const auth = require('../middlewares/auth');

// Ruta Protegida: Obtener todas las ubicaciones
router.get('/', auth, tiendasFisicasController.obtenerTiendas);

// Ruta para inicializar datos (Solo para desarrollo, se puede eliminar después)
router.post('/demo', tiendasFisicasController.insertarTiendasDemo);

module.exports = router;