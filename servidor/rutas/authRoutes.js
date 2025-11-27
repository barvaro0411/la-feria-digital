const express = require('express');
const router = express.Router();
const { registro, login, obtenerPerfil } = require('../controladores/authController');
const auth = require('../middlewares/auth');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Público
router.post('/register', registro);

// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Público
router.post('/login', login);

// @route   GET /api/auth/perfil
// @desc    Obtener perfil de usuario
// @access  Privado
router.get('/perfil', auth, obtenerPerfil);

module.exports = router;
