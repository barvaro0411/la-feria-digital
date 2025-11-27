// CÓDIGO FINAL LIMPIO para: servidor/controladores/authController.js

const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.registrar = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    let usuario = await Usuario.findOne({ correo });
    if (usuario) return res.status(400).json({ msg: 'El correo ya está registrado' });

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    usuario = new Usuario({
      nombre,
      correo,
      password: hash
    });

    await usuario.save();
    res.json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el registro', error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });

    const esMatch = await bcrypt.compare(password, usuario.password);
    if (!esMatch) return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });

    // Se eliminó el console.log de diagnóstico.
    
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      usuario: { nombre: usuario.nombre, correo: usuario.correo }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el login', error: error.message });
  }
};