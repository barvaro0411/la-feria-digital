const Usuario = require('../modelos/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Registrar nuevo usuario
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar datos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Por favor completa todos los campos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Por favor ingresa email y contraseña'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener perfil de usuario
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener perfil'
    });
  }
};
