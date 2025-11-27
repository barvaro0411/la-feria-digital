// CÓDIGO FINAL para: servidor/rutas/codigosRoutes.js

const express = require('express');
const router = express.Router();
const codigosController = require('../controladores/codigosController');
const auth = require('../middlewares/auth');

// Rutas Protegidas (Requieren Token JWT)
router.get('/', auth, codigosController.obtenerCodigos);
router.post('/', auth, codigosController.crearCodigo);
router.put('/:id/votar', auth, codigosController.votarCodigo);
router.put('/:id/verificar', auth, codigosController.verificarCodigo);

// RUTA PARA SCRAPER (No requiere Token JWT)
router.post('/scraper', codigosController.insertarCodigosScraper);

module.exports = router;