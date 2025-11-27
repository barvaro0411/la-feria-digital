// CÓDIGO para el NUEVO ARCHIVO: servidor/rutas/comparadorRoutes.js

const express = require('express');
const router = express.Router();
const comparadorController = require('../controladores/comparadorController');
const auth = require('../middlewares/auth');

// Ruta Protegida: GET /api/comparador/buscar?producto=X&categoria=Y
router.get('/buscar', auth, comparadorController.buscarPrecios);

module.exports = router;