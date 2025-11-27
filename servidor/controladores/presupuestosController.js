const Presupuesto = require('../modelos/Presupuesto');
const Transaccion = require('../modelos/Transaccion');

// @desc    Obtener presupuesto del mes actual
// @route   GET /api/presupuestos/actual
// @access  Privado
exports.obtenerPresupuestoActual = async (req, res) => {
  try {
    const fecha = new Date();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    
    let presupuesto = await Presupuesto.findOne({
      usuario: req.usuario.id,
      mes,
      anio
    });
    
    // Si no existe, crear uno vacío
    if (!presupuesto) {
      presupuesto = await Presupuesto.create({
        usuario: req.usuario.id,
        mes,
        anio,
        categorias: []
      });
    }
    
    res.json({
      success: true,
      data: presupuesto
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

// @desc    Crear/Actualizar presupuesto
// @route   POST /api/presupuestos
// @access  Privado
exports.crearPresupuesto = async (req, res) => {
  try {
    const { mes, anio, categorias, notas } = req.body;
    
    // Buscar si ya existe
    const presupuestoExistente = await Presupuesto.findOne({
      usuario: req.usuario.id,
      mes,
      anio
    });
    
    if (presupuestoExistente) {
      // Actualizar
      presupuestoExistente.categorias = categorias;
      presupuestoExistente.notas = notas;
      await presupuestoExistente.save();
      
      return res.json({
        success: true,
        data: presupuestoExistente,
        mensaje: 'Presupuesto actualizado'
      });
    }
    
    // Crear nuevo
    const presupuesto = await Presupuesto.create({
      usuario: req.usuario.id,
      mes,
      anio,
      categorias,
      notas
    });
    
    res.status(201).json({
      success: true,
      data: presupuesto,
      mensaje: '💵 Presupuesto creado'
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

// @desc    Actualizar gastos del presupuesto basado en transacciones
// @route   PUT /api/presupuestos/:id/sincronizar
// @access  Privado
exports.sincronizarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    
    if (!presupuesto) {
      return res.status(404).json({ success: false, mensaje: 'Presupuesto no encontrado' });
    }
    
    if (presupuesto.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ success: false, mensaje: 'No autorizado' });
    }
    
    // Calcular gastos reales del mes
    const fechaInicio = new Date(presupuesto.anio, presupuesto.mes - 1, 1);
    const fechaFin = new Date(presupuesto.anio, presupuesto.mes, 0, 23, 59, 59);
    
    const gastosPorCategoria = await Transaccion.aggregate([
      {
        $match: {
          usuario: presupuesto.usuario,
          tipo: 'gasto',
          fecha: { $gte: fechaInicio, $lte: fechaFin }
        }
      },
      {
        $group: {
          _id: '$categoria',
          total: { $sum: '$monto' }
        }
      }
    ]);
    
    // Actualizar cada categoría
    presupuesto.categorias.forEach(cat => {
      const gastoReal = gastosPorCategoria.find(g => g._id === cat.nombre);
      cat.gastado = gastoReal ? gastoReal.total : 0;
    });
    
    await presupuesto.save();
    
    res.json({
      success: true,
      data: presupuesto,
      mensaje: 'Presupuesto sincronizado'
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

// @desc    Obtener historial de presupuestos
// @route   GET /api/presupuestos/historial
// @access  Privado
exports.obtenerHistorial = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find({ usuario: req.usuario.id })
      .sort({ anio: -1, mes: -1 })
      .limit(12);
    
    res.json({
      success: true,
      count: presupuestos.length,
      data: presupuestos
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};
