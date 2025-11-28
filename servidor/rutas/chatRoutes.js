// servidor/rutas/chatRoutes.js
const express = require('express');
const router = express.Router();
const { enviarMensaje, obtenerAlertas } = require('../controladores/chatController');
const auth = require('../middlewares/auth');

// Todas las rutas de chat requieren auth
router.use(auth);

// POST /api/chat/nubi  ← IMPORTANTE que sea /nubi
router.post('/nubi', enviarMensaje);

// GET /api/chat/alertas
router.get('/alertas', obtenerAlertas);

module.exports = router;
