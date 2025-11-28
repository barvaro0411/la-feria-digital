const Evento = require('../modelos/Evento');
const Codigo = require('../modelos/Codigo');
const Alerta = require('../modelos/Alerta');
const Meta = require('../modelos/MetaAhorro');   
const Presupuesto = require('../modelos/Presupuesto');
const Transaccion = require('../modelos/Transaccion');

// ================== HELPERS GENERALES ==================

async function yaHayAlertaHoy(usuario, tipo, categoria) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const existe = await Alerta.findOne({
    usuario,
    tipo,
    categoria,
    creadoEn: { $gte: hoy }
  });

  return !!existe;
}

async function crearAlerta(usuario, datos) {
  return Alerta.create({
    usuario,
    tipo: datos.tipo,          // 'recomendacion' | 'consejo' | 'info'
    categoria: datos.categoria, // 'Cupones' | 'Metas' | 'Presupuesto' | 'Transacciones'
    titulo: datos.titulo,
    mensaje: datos.mensaje,
    data: datos.data || {},
    leida: false
  });
}

// ================== LÓGICA POR SECCIÓN ==================

// Cupones (visita general)
async function manejarVisitaCupones(usuarioId) {
  const existeHoy = await yaHayAlertaHoy(usuarioId, 'recomendacion', 'Cupones');
  if (existeHoy) return;

  const mejorCupon = await Codigo.findOne({})
    .sort({ descuentoPorcentaje: -1, usos: -1 });

  if (!mejorCupon) return;

  await crearAlerta(usuarioId, {
    tipo: 'recomendacion',
    categoria: 'Cupones',
    titulo: 'Nubi encontró un cupón que te conviene',
    mensaje: `Has estado viendo cupones. El mejor ahorro ahora mismo es "${mejorCupon.titulo}" con ${mejorCupon.descuento}.`,
    data: { cuponId: mejorCupon._id }
  });
}

// Cupones por categoría (Comida, Tecnología, etc.)
async function manejarVisitaCuponesCategoria(usuarioId, categoria) {
  const existeHoy = await yaHayAlertaHoy(usuarioId, 'recomendacion', 'Cupones');
  if (existeHoy) return;

  const mejorCupon = await Codigo.findOne({ categoria })
    .sort({ descuentoPorcentaje: -1, usos: -1 });

  if (!mejorCupon) return;

  await crearAlerta(usuarioId, {
    tipo: 'recomendacion',
    categoria: 'Cupones',
    titulo: `Este cupón de ${categoria} te conviene hoy`,
    mensaje: `Has estado buscando cupones de ${categoria}. El mejor ahorro ahora mismo es "${mejorCupon.titulo}" con ${mejorCupon.descuento}.`,
    data: { cuponId: mejorCupon._id }
  });
}

// Metas
async function manejarVisitaMetas(usuarioId) {
  const existeHoy = await yaHayAlertaHoy(usuarioId, 'recomendacion', 'Metas');
  if (existeHoy) return;

  const metas = await Meta.find({ usuario: usuarioId });
  const metasActivas = metas.filter(m => m.estado === 'activa');

  if (metasActivas.length === 0) {
    await crearAlerta(usuarioId, {
      tipo: 'consejo',
      categoria: 'Metas',
      titulo: 'Crea tu primera meta de ahorro',
      mensaje: 'No tienes metas activas. Crear metas te ayuda a ahorrar con un objetivo claro. 🎯',
      data: {}
    });
    return;
  }

  const metaMasCercana = metasActivas
    .sort((a, b) => parseFloat(b.progreso) - parseFloat(a.progreso))[0];

  await crearAlerta(usuarioId, {
    tipo: 'recomendacion',
    categoria: 'Metas',
    titulo: `Estás cerca de lograr "${metaMasCercana.nombre}"`,
    mensaje: `Tu meta "${metaMasCercana.nombre}" va en ${metaMasCercana.progreso}%. Si aportas un poco más hoy, estarás mucho más cerca de completarla. 💰`,
    data: { metaId: metaMasCercana._id }
  });
}

// Presupuesto
async function manejarVisitaPresupuesto(usuarioId) {
  const existeHoy = await yaHayAlertaHoy(usuarioId, 'recomendacion', 'Presupuesto');
  if (existeHoy) return;

  const ahora = new Date();
  const mes = ahora.getMonth() + 1;
  const anio = ahora.getFullYear();

  const presupuesto = await Presupuesto.findOne({ usuario: usuarioId, mes, anio });
  if (!presupuesto) {
    await crearAlerta(usuarioId, {
      tipo: 'consejo',
      categoria: 'Presupuesto',
      titulo: 'Configura tu presupuesto mensual',
      mensaje: 'Aún no tienes un presupuesto para este mes. Definir límites por categoría te ayudará a controlar mejor tus gastos. 💼',
      data: {}
    });
    return;
  }

  const porcentaje = presupuesto.porcentajeUsado || 0;

  if (porcentaje < 60) {
    await crearAlerta(usuarioId, {
      tipo: 'info',
      categoria: 'Presupuesto',
      titulo: 'Vas bien con tu presupuesto',
      mensaje: `Has usado el ${porcentaje}% de tu presupuesto mensual. Sigue así y no olvides revisar tus gastos de vez en cuando. ✅`,
      data: { presupuestoId: presupuesto._id }
    });
  } else {
    const catCritica = presupuesto.categorias
      ?.sort((a, b) => (b.gastado / b.limite) - (a.gastado / a.limite))[0];

    await crearAlerta(usuarioId, {
      tipo: 'recomendacion',
      categoria: 'Presupuesto',
      titulo: `Ojo con tu presupuesto (${porcentaje}%)`,
      mensaje: catCritica
        ? `Has usado el ${porcentaje}% de tu presupuesto. La categoría más delicada es "${catCritica.nombre}" con ${(catCritica.gastado / catCritica.limite * 100).toFixed(0)}% usado. ⚠️`
        : `Has usado el ${porcentaje}% de tu presupuesto. Revisa tus categorías para evitar sobrepasar el límite. ⚠️`,
      data: { presupuestoId: presupuesto._id }
    });
  }
}

// Transacciones
async function manejarVisitaTransacciones(usuarioId) {
  const existeHoy = await yaHayAlertaHoy(usuarioId, 'consejo', 'Transacciones');
  if (existeHoy) return;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const transHoy = await Transaccion.find({
    usuario: usuarioId,
    fecha: { $gte: hoy, $lt: manana }
  });

  if (transHoy.length === 0) {
    await crearAlerta(usuarioId, {
      tipo: 'consejo',
      categoria: 'Transacciones',
      titulo: 'Registra tus gastos de hoy',
      mensaje: 'Hoy aún no has registrado transacciones. Anotar tus gastos al día te ayuda a mantener tus finanzas bajo control. 📝',
      data: {}
    });
  }
}

// ================== CONTROLADOR PRINCIPAL ==================

exports.registrarEvento = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const { tipo, datos } = req.body;

    if (!tipo) {
      return res.status(400).json({
        success: false,
        mensaje: 'El tipo de evento es obligatorio'
      });
    }

    const evento = await Evento.create({
      usuario: usuarioId,
      tipo,
      datos: datos || {}
    });

    switch (tipo) {
      case 'visita_cupones':
        await manejarVisitaCupones(usuarioId);
        break;
      case 'visita_cupones_categoria':
        if (datos?.categoria) {
          await manejarVisitaCuponesCategoria(usuarioId, datos.categoria);
        }
        break;
      case 'visita_metas':
        await manejarVisitaMetas(usuarioId);
        break;
      case 'visita_presupuesto':
        await manejarVisitaPresupuesto(usuarioId);
        break;
      case 'visita_transacciones':
        await manejarVisitaTransacciones(usuarioId);
        break;
      default:
        break;
    }

    res.status(201).json({
      success: true,
      data: evento
    });
  } catch (error) {
    console.error('Error registrando evento:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar evento',
      error: error.message
    });
  }
};
