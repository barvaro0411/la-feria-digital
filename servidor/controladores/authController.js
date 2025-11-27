const Usuario = require('../modelos/Usuario');
const jwt = require('jsonwebtoken');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Público
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false,
        msg: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      msg: '✅ Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Público
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        msg: 'Credenciales inválidas' 
      });
    }

    // Verificar password
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).json({ 
        success: false,
        msg: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        nivel: usuario.nivel,
        ahorroTotal: usuario.ahorroTotal
      },
      msg: '✅ Login exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Privado
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .select('-password')
      .populate('metasActivas')
      .populate('presupuestoActual');

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};
