const MetaAhorro = require('../modelos/MetaAhorro');
const Usuario = require('../modelos/Usuario');

// @desc    Obtener metas del usuario
// @route   GET /api/metas
// @access  Privado
exports.obtenerMetas = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = { usuario: req.usuario.id };
    
    if (estado) filtro.estado = estado;
    
    const metas = await MetaAhorro.find(filtro).sort({ fechaLimite: 1 });
    
    res.json({
      success: true,
      count: metas.length,
      data: metas
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

// @desc    Crear nueva meta
// @route   POST /api/metas
// @access  Privado
exports.crearMeta = async (req, res) => {
  try {
    const { nombre, descripcion, montoObjetivo, fechaLimite, categoria, icono, color } = req.body;
    
    const meta = await MetaAhorro.create({
      usuario: req.usuario.id,
      nombre,
      descripcion,
      montoObjetivo,
      fechaLimite,
      categoria,
      icono,
      color
    });
    
    // Agregar a metas activas del usuario
    await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { $push: { metasActivas: meta._id } }
    );
    
    res.status(201).json({
      success: true,
      data: meta,
      mensaje: '🎯 Meta de ahorro creada'
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

// @desc    Agregar fondos a una meta
// @route   PUT /api/metas/:id/agregar-fondos
// @access  Privado
exports.agregarFondos = async (req, res) => {
  try {
    const { monto } = req.body;
    
    if (!monto || monto <= 0) {
      return res.status(400).json({ success: false, mensaje: 'Monto inválido' });
    }
    
    const meta = await MetaAhorro.findById(req.params.id);
    
    if (!meta) {
      return res.status(404).json({ success: false, mensaje: 'Meta no encontrada' });
    }
    
    if (meta.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ success: false, mensaje: 'No autorizado' });
    }
    
    await meta.agregarFondos(monto);
    
    let mensaje = `💰 Agregaste $${monto.toLocaleString()} a tu meta`;
    
    if (meta.estado === 'completada') {
      mensaje = `🎉 ¡Felicitaciones! Completaste tu meta "${meta.nombre}"`;
      
      // Dar puntos extra por completar meta
      const usuario = await Usuario.findById(req.usuario.id);
      usuario.puntosExperiencia += 500;
      await usuario.save();
      await usuario.actualizarNivel();
    }
    
    res.json({
      success: true,
      data: meta,
      mensaje
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

// @desc    Actualizar meta
// @route   PUT /api/metas/:id
// @access  Privado
exports.actualizarMeta = async (req, res) => {
  try {
    const meta = await MetaAhorro.findById(req.params.id);
    
    if (!meta) {
      return res.status(404).json({ success: false, mensaje: 'Meta no encontrada' });
    }
    
    if (meta.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ success: false, mensaje: 'No autorizado' });
    }
    
    const metaActualizada = await MetaAhorro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: metaActualizada,
      mensaje: 'Meta actualizada'
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

// @desc    Eliminar meta
// @route   DELETE /api/metas/:id
// @access  Privado
exports.eliminarMeta = async (req, res) => {
  try {
    const meta = await MetaAhorro.findById(req.params.id);
    
    if (!meta) {
      return res.status(404).json({ success: false, mensaje: 'Meta no encontrada' });
    }
    
    if (meta.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ success: false, mensaje: 'No autorizado' });
    }
    
    await meta.deleteOne();
    
    // Remover de metas activas del usuario
    await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { $pull: { metasActivas: meta._id } }
    );
    
    res.json({ success: true, mensaje: 'Meta eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};
