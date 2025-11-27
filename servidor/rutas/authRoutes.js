const express = require('express');
const router = express.Router();
const authController = require('../controladores/authController');

// Registro
router.post('/registro', authController.registrar);

// Login
router.post('/login', authController.login);

module.exports = router;
