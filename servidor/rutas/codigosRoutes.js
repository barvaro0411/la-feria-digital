const express = require('express');
const router = express.Router();
const codigosController = require('../controladores/codigosController');
const auth = require('../middlewares/auth');
const apiKeyAuth = require('../middlewares/apiKeyAuth'); // ✅ Importar nuevo middleware

// Rutas Protegidas (Usuarios)
router.get('/', auth, codigosController.obtenerCodigos);
router.post('/', auth, codigosController.crearCodigo);
router.put('/:id/votar', auth, codigosController.votarCodigo);
router.put('/:id/verificar', auth, codigosController.verificarCodigo);

// RUTA PARA SCRAPER (Protegida con API Key en lugar de Token de Usuario)
router.post('/scraper', apiKeyAuth, codigosController.insertarCodigosScraper); // ✅ Protegido

module.exports = router;