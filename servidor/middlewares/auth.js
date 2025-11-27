const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      msg: 'No token, acceso denegado' 
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario completo en la base de datos
    const usuario = await Usuario.findById(decoded.id).select('-password');
    
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        msg: 'Usuario no encontrado' 
      });
    }
    
    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ 
        success: false,
        msg: 'Usuario desactivado' 
      });
    }
    
    // Agregar usuario completo al request
    req.usuario = usuario;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        msg: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        msg: 'Token no válido' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      msg: 'Error en el servidor' 
    });
  }
};

module.exports = auth;
