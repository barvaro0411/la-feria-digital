const Transaccion = require('../modelos/Transaccion');
const Usuario = require('../modelos/Usuario');
const Codigo = require('../modelos/Codigo');

// @desc    Obtener todas las transacciones del usuario
// @route   GET /api/transacciones
// @access  Privado
exports.obtenerTransacciones = async (req, res) => {
  try {
    const { tipo, categoria, fechaInicio, fechaFin, limit = 50, page = 1 } = req.query;
    
    const filtro = { usuario: req.usuario.id };
    
    if (tipo) filtro.tipo = tipo;
    if (categoria) filtro.categoria = categoria;
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }
    
    const transacciones = await Transaccion.find(filtro)
      .populate('cuponUtilizado', 'codigo tienda descuento')
      .sort({ fecha: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Transaccion.countDocuments(filtro);
    
    res.json({
      success: true,
      count: transacciones.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transacciones
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

// @desc    Crear nueva transacción
// @route   POST /api/transacciones
// @access  Privado
exports.crearTransaccion = async (req, res) => {
  try {
    const { tipo, monto, categoria, descripcion, fecha, cuponUtilizado, montoOriginal } = req.body;
    
    const transaccion = await Transaccion.create({
      usuario: req.usuario.id,
      tipo,
      monto,
      categoria,
      descripcion,
      fecha: fecha || Date.now(),
      cuponUtilizado: cuponUtilizado || null,
      montoOriginal: montoOriginal || null
    });
    
    // Actualizar estadísticas del usuario
    const usuario = await Usuario.findById(req.usuario.id);
    usuario.estadisticas.transaccionesRegistradas += 1;
    
    // Si usó cupón, actualizar ahorro total
    if (transaccion.ahorroGenerado > 0) {
      usuario.ahorroTotal += transaccion.ahorroGenerado;
      usuario.estadisticas.totalAhorrado += transaccion.ahorroGenerado;
      usuario.estadisticas.cuponesUsados += 1;
      usuario.puntosExperiencia += Math.floor(transaccion.ahorroGenerado / 100); // 1 punto por cada $100 ahorrados
    }
    
    await usuario.save();
    await usuario.actualizarNivel();
    
    res.status(201).json({
      success: true,
      data: transaccion,
      mensaje: '💰 Transacción registrada exitosamente'
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

// @desc    Obtener estadísticas de transacciones
// @route   GET /api/transacciones/estadisticas
// @access  Privado
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const usuarioId = req.usuario.id;
    
    const filtro = { usuario: usuarioId };
    
    if (mes && anio) {
      const fechaInicio = new Date(anio, mes - 1, 1);
      const fechaFin = new Date(anio, mes, 0, 23, 59, 59);
      filtro.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }
    
    // Agregar estadísticas
    const estadisticas = await Transaccion.aggregate([
      { $match: filtro },
      {
        $group: {
          _id: '$tipo',
          total: { $sum: '$monto' },
          cantidad: { $count: {} }
        }
      }
    ]);
    
    // Agrupar por categoría
    const porCategoria = await Transaccion.aggregate([
      { $match: { ...filtro, tipo: 'gasto' } },
      {
        $group: {
          _id: '$categoria',
          total: { $sum: '$monto' },
          cantidad: { $count: {} }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    // Calcular ahorro total
    const ahorroTotal = await Transaccion.aggregate([
      { $match: filtro },
      {
        $group: {
          _id: null,
          totalAhorro: { $sum: '$ahorroGenerado' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        resumen: estadisticas,
        porCategoria,
        ahorroTotal: ahorroTotal[0]?.totalAhorro || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

// @desc    Eliminar transacción
// @route   DELETE /api/transacciones/:id
// @access  Privado
exports.eliminarTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id);
    
    if (!transaccion) {
      return res.status(404).json({ success: false, mensaje: 'Transacción no encontrada' });
    }
    
    // Verificar que sea del usuario
    if (transaccion.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ success: false, mensaje: 'No autorizado' });
    }
    
    await transaccion.deleteOne();
    
    res.json({ success: true, mensaje: 'Transacción eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};
    