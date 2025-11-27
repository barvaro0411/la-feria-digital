const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');

module.exports = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: 'No autorizado. Token no proporcionado'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    req.usuario = await Usuario.findById(decoded.id);

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};
