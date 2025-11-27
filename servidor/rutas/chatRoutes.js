const express = require('express');
const router = express.Router();
const { enviarMensaje, obtenerAlertas } = require('../controladores/chatController');
const auth = require('../middlewares/auth'); // ✅ CORREGIDO

// Todas las rutas requieren autenticación
router.use(auth); // ✅ CORREGIDO

// POST /api/chat/mensaje - Enviar mensaje a Nubi
router.post('/mensaje', enviarMensaje);

// GET /api/chat/alertas - Obtener alertas proactivas
router.get('/alertas', obtenerAlertas);

module.exports = router;
