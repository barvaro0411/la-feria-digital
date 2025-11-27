const nubiIA = require('../servicios/nubiIA');
const Transaccion = require('../modelos/Transaccion');
const MetaAhorro = require('../modelos/MetaAhorro');
const Presupuesto = require('../modelos/Presupuesto');

// @desc    Enviar mensaje a Nubi y obtener respuesta
// @route   POST /api/chat/mensaje
// @access  Privado
exports.enviarMensaje = async (req, res) => {
  try {
    const { mensaje } = req.body;
    const usuarioId = req.usuario._id;

    // Obtener contexto del usuario
    const contexto = await obtenerContextoUsuario(usuarioId);

    // Generar respuesta con IA
    const respuesta = await nubiIA.generarRespuesta(mensaje, contexto);

    res.json({
      success: true,
      respuesta,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al procesar el mensaje'
    });
  }
};

// @desc    Obtener análisis proactivo
// @route   GET /api/chat/alertas
// @access  Privado
exports.obtenerAlertas = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const contexto = await obtenerContextoUsuario(usuarioId);
    
    const alertas = nubiIA.analizarSituacionFinanciera(contexto);

    res.json({
      success: true,
      alertas
    });
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener alertas'
    });
  }
};

// Función auxiliar para obtener contexto
async function obtenerContextoUsuario(usuarioId) {
  const fecha = new Date();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  // Obtener transacciones del mes
  const inicioMes = new Date(anio, mes - 1, 1);
  const finMes = new Date(anio, mes, 0, 23, 59, 59);
  
  const transacciones = await Transaccion.find({
    usuario: usuarioId,
    fecha: { $gte: inicioMes, $lte: finMes }
  });

  // Calcular estadísticas
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalAhorro = transacciones
    .reduce((sum, t) => sum + (t.ahorroGenerado || 0), 0);

  // Obtener metas activas
  const metas = await MetaAhorro.find({
    usuario: usuarioId,
    estado: 'activa'
  }).limit(5);

  // Obtener presupuesto actual
  const presupuesto = await Presupuesto.findOne({
    usuario: usuarioId,
    mes,
    anio
  });

  return {
    transacciones,
    metas,
    presupuesto,
    estadisticas: {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      totalAhorro
    },
    cuponesDisponibles: 12 // Esto después lo conectas con tu sistema de cupones
  };
}

module.exports = exports;
