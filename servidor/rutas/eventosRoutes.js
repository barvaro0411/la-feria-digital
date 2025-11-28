const express = require('express');
const router = express.Router();
const { registrarEvento } = require('../controladores/eventosController');
const auth = require('../middlewares/auth');

// Todas las rutas de eventos requieren auth
router.use(auth);

// POST /api/eventos
router.post('/', registrarEvento);

module.exports = router;
