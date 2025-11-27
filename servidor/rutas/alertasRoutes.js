// CÓDIGO para el NUEVO ARCHIVO: servidor/rutas/alertasRoutes.js

const express = require('express');
const router = express.Router();
const alertasController = require('../controladores/alertasController');
const auth = require('../middlewares/auth');

// Rutas Protegidas
router.get('/', auth, alertasController.obtenerSuscripciones);
router.post('/toggle', auth, alertasController.toggleSuscripcion);

module.exports = router;