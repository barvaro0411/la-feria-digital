const express = require('express');
const router = express.Router();
const { register, login, obtenerPerfil } = require('../controladores/authController');
const auth = require('../middlewares/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', auth, obtenerPerfil);

module.exports = router;
