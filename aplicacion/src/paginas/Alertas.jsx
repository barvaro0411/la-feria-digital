import { useState, useEffect } from 'react';
import { obtenerTransacciones, obtenerMetas, obtenerPresupuestoActual } from '../servicios/finanzasApi';

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [configuracion, setConfiguracion] = useState({
    presupuesto75: true,
    presupuesto90: true,
    metaCercana: true,
    metaAlcanzada: true,
    gastoAlto: true,
    cuponNuevo: true,
  });
  const [mostrarConfig, setMostrarConfig] = useState(false);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      setCargando(true);
      const alertasGeneradas = [];
      
      // Obtener datos
      const [transaccionesRes, metasRes, presupuestoRes] = await Promise.all([
        obtenerTransacciones(),
        obtenerMetas('activa'),
        obtenerPresupuestoActual()
      ]);

      const transacciones = transaccionesRes.data.data || [];
      const metas = metasRes.data.data || [];
      const presupuesto = presupuestoRes.data;

      // 1. Alertas de Presupuesto
      if (presupuesto && presupuesto.categorias) {
        presupuesto.categorias.forEach(cat => {
          const porcentaje = (cat.gastado / cat.limite) * 100;
          
          if (porcentaje >= 100 && configuracion.presupuesto90) {
            alertasGeneradas.push({
              id: `presupuesto-${cat.nombre}-100`,
              tipo: 'critico',
              categoria: 'Presupuesto',
              titulo: `¡Límite excedido en ${cat.nombre}!`,
              mensaje: `Has superado tu presupuesto en ${cat.nombre}. Gastaste $${cat.gastado.toLocaleString()} de $${cat.limite.toLocaleString()}.`,
              icono: '🚨',
              fecha: new Date(),
              leida: false,
              accion: '/presupuesto'
            });
          } else if (porcentaje >= 90 && configuracion.presupuesto90) {
            alertasGeneradas.push({
              id: `presupuesto-${cat.nombre}-90`,
              tipo: 'advertencia',
              categoria: 'Presupuesto',
              titulo: `Alerta: ${porcentaje.toFixed(0)}% del presupuesto en ${cat.nombre}`,
              mensaje: `Has usado el ${porcentaje.toFixed(0)}% de tu presupuesto en ${cat.nombre}. Te quedan $${(cat.limite - cat.gastado).toLocaleString()}.`,
              icono: '⚠️',
              fecha: new Date(),
              leida: false,
              accion: '/presupuesto'
            });
          } else if (porcentaje >= 75 && configuracion.presupuesto75) {
            alertasGeneradas.push({
              id: `presupuesto-${cat.nombre}-75`,
              tipo: 'info',
              categoria: 'Presupuesto',
              titulo: `${porcentaje.toFixed(0)}% del presupuesto usado en ${cat.nombre}`,
              mensaje: `Has usado el ${porcentaje.toFixed(0)}% de tu presupuesto en ${cat.nombre}.`,
              icono: '💡',
              fecha: new Date(),
              leida: false,
              accion: '/presupuesto'
            });
          }
        });
      }

      // 2. Alertas de Metas
      metas.forEach(meta => {
        const progreso = parseFloat(meta.progreso);
        
        if (progreso >= 100 && configuracion.metaAlcanzada) {
          alertasGeneradas.push({
            id: `meta-${meta._id}-completada`,
            tipo: 'exito',
            categoria: 'Metas',
            titulo: `🎉 ¡Meta alcanzada: ${meta.nombre}!`,
            mensaje: `¡Felicitaciones! Has completado tu meta "${meta.nombre}" de $${meta.montoObjetivo.toLocaleString()}.`,
            icono: '🏆',
            fecha: new Date(),
            leida: false,
            accion: '/metas'
          });
        } else if (progreso >= 90 && progreso < 100 && configuracion.metaCercana) {
          const falta = meta.montoObjetivo - (meta.montoActual || 0);
          alertasGeneradas.push({
            id: `meta-${meta._id}-cercana`,
            tipo: 'info',
            categoria: 'Metas',
            titulo: `¡Casi lo logras! ${meta.nombre} al ${progreso.toFixed(0)}%`,
            mensaje: `Estás muy cerca de alcanzar tu meta "${meta.nombre}". Solo faltan $${falta.toLocaleString()}.`,
            icono: '🎯',
            fecha: new Date(),
            leida: false,
            accion: '/metas'
          });
        }

        // Fecha límite cercana
        if (meta.fechaLimite && configuracion.metaCercana) {
          const diasRestantes = Math.ceil((new Date(meta.fechaLimite) - new Date()) / (1000 * 60 * 60 * 24));
          if (diasRestantes <= 7 && diasRestantes > 0 && progreso < 100) {
            alertasGeneradas.push({
              id: `meta-${meta._id}-deadline`,
              tipo: 'advertencia',
              categoria: 'Metas',
              titulo: `⏰ Fecha límite cercana: ${meta.nombre}`,
              mensaje: `Tu meta "${meta.nombre}" vence en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}. Progreso actual: ${progreso.toFixed(0)}%.`,
              icono: '⏰',
              fecha: new Date(),
              leida: false,
              accion: '/metas'
            });
          }
        }
      });

      // 3. Alertas de Gastos Altos
      if (transacciones.length > 0 && configuracion.gastoAlto) {
        const gastos = transacciones.filter(t => t.tipo === 'gasto');
        if (gastos.length > 0) {
          const promedioGasto = gastos.reduce((sum, t) => sum + t.monto, 0) / gastos.length;
          const gastosAltos = gastos.filter(t => t.monto > promedioGasto * 2);
          
          gastosAltos.slice(0, 3).forEach(gasto => {
            alertasGeneradas.push({
              id: `gasto-alto-${gasto._id}`,
              tipo: 'advertencia',
              categoria: 'Gastos',
              titulo: '💸 Gasto alto detectado',
              mensaje: `Registraste un gasto de $${gasto.monto.toLocaleString()} en ${gasto.categoria} (${gasto.descripcion}). Esto es el doble de tu promedio.`,
              icono: '💸',
              fecha: new Date(gasto.fecha),
              leida: false,
              accion: '/transacciones'
            });
          });
        }
      }

      // 4. Alertas de Cupones (simuladas)
      if (configuracion.cuponNuevo) {
        const tiendas = ['Tecnología', 'Alimentación', 'Entretenimiento'];
        tiendas.forEach(tienda => {
          if (Math.random() > 0.7) {
            alertasGeneradas.push({
              id: `cupon-${tienda}-${Date.now()}`,
              tipo: 'info',
              categoria: 'Cupones',
              titulo: `🎟️ Nuevo cupón en ${tienda}`,
              mensaje: `Hay un nuevo cupón de descuento disponible en ${tienda}. ¡No te lo pierdas!`,
              icono: '🎟️',
              fecha: new Date(Date.now() - Math.random() * 86400000),
              leida: false,
              accion: '/inicio'
            });
          }
        });
      }

      // 5. Consejos financieros
      alertasGeneradas.push({
        id: 'consejo-1',
        tipo: 'consejo',
        categoria: 'Consejos',
        titulo: '💡 Consejo del día',
        mensaje: 'Considera usar la regla 50/30/20: 50% para necesidades, 30% para deseos y 20% para ahorros.',
        icono: '💡',
        fecha: new Date(),
        leida: false,
        accion: null
      });

      // Ordenar por fecha (más recientes primero)
      alertasGeneradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setAlertas(alertasGeneradas);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setCargando(false);
    }
  };

  const marcarLeida = (id) => {
    setAlertas(alertas.map(a => 
      a.id === id ? { ...a, leida: true } : a
    ));
  };

  const marcarTodasLeidas = () => {
    setAlertas(alertas.map(a => ({ ...a, leida: true })));
  };

  const eliminarAlerta = (id) => {
    setAlertas(alertas.filter(a => a.id !== id));
  };

  // Filtrar alertas
  const alertasFiltradas = alertas.filter(alerta => {
    if (filtroTipo !== 'todas' && alerta.tipo !== filtroTipo) return false;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      return (
        alerta.titulo.toLowerCase().includes(busquedaLower) ||
        alerta.mensaje.toLowerCase().includes(busquedaLower) ||
        alerta.categoria.toLowerCase().includes(busquedaLower)
      );
    }
    return true;
  });

  const alertasNoLeidas = alertas.filter(a => !a.leida).length;

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'critico':
        return 'from-red-600 to-red-700 border-red-500';
      case 'advertencia':
        return 'from-yellow-600 to-yellow-700 border-yellow-500';
      case 'exito':
        return 'from-green-600 to-green-700 border-green-500';
      case 'info':
        return 'from-blue-600 to-blue-700 border-blue-500';
      case 'consejo':
        return 'from-purple-600 to-purple-700 border-purple-500';
      default:
        return 'from-gray-600 to-gray-700 border-gray-500';
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-5xl">🔔</span>
              Centro de Notificaciones
            </h1>
            <p className="text-gray-400 mt-2">
              {alertasNoLeidas} {alertasNoLeidas === 1 ? 'alerta sin leer' : 'alertas sin leer'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setMostrarConfig(!mostrarConfig)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold transition flex items-center gap-2"
            >
              ⚙️ Configurar
            </button>
            <button
              onClick={marcarTodasLeidas}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition flex items-center gap-2"
            >
              ✓ Marcar todas leídas
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white text-center hover:scale-105 transition">
            <div className="text-3xl mb-1">🚨</div>
            <div className="text-2xl font-bold">{alertas.filter(a => a.tipo === 'critico').length}</div>
            <div className="text-xs opacity-90">Críticas</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white text-center hover:scale-105 transition">
            <div className="text-3xl mb-1">⚠️</div>
            <div className="text-2xl font-bold">{alertas.filter(a => a.tipo === 'advertencia').length}</div>
            <div className="text-xs opacity-90">Advertencias</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center hover:scale-105 transition">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-bold">{alertas.filter(a => a.tipo === 'exito').length}</div>
            <div className="text-xs opacity-90">Éxitos</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center hover:scale-105 transition">
            <div className="text-3xl mb-1">💡</div>
            <div className="text-2xl font-bold">{alertas.filter(a => a.tipo === 'info').length}</div>
            <div className="text-xs opacity-90">Informativas</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center hover:scale-105 transition">
            <div className="text-3xl mb-1">💭</div>
            <div className="text-2xl font-bold">{alertas.filter(a => a.tipo === 'consejo').length}</div>
            <div className="text-xs opacity-90">Consejos</div>
          </div>
        </div>

        {/* Configuración */}
        {mostrarConfig && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              ⚙️ Configuración de Alertas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.presupuesto75}
                  onChange={(e) => setConfiguracion({ ...configuracion, presupuesto75: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Presupuesto al 75%</p>
                  <p className="text-gray-400 text-sm">Alertar cuando uses el 75% del presupuesto</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.presupuesto90}
                  onChange={(e) => setConfiguracion({ ...configuracion, presupuesto90: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Presupuesto al 90%</p>
                  <p className="text-gray-400 text-sm">Alertar cuando uses el 90% del presupuesto</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.metaCercana}
                  onChange={(e) => setConfiguracion({ ...configuracion, metaCercana: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Meta cercana al objetivo</p>
                  <p className="text-gray-400 text-sm">Alertar cuando una meta llegue al 90%</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.metaAlcanzada}
                  onChange={(e) => setConfiguracion({ ...configuracion, metaAlcanzada: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Meta alcanzada</p>
                  <p className="text-gray-400 text-sm">Felicitaciones al completar una meta</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.gastoAlto}
                  onChange={(e) => setConfiguracion({ ...configuracion, gastoAlto: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Gastos altos</p>
                  <p className="text-gray-400 text-sm">Alertar sobre gastos superiores al promedio</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.cuponNuevo}
                  onChange={(e) => setConfiguracion({ ...configuracion, cuponNuevo: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-semibold">Nuevos cupones</p>
                  <p className="text-gray-400 text-sm">Notificar sobre cupones nuevos</p>
                </div>
              </label>
            </div>
            <button
              onClick={() => {
                setMostrarConfig(false);
                cargarAlertas();
              }}
              className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition"
            >
              💾 Guardar y Actualizar
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Buscar alertas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="todas">Todas las alertas</option>
              <option value="critico">🚨 Críticas</option>
              <option value="advertencia">⚠️ Advertencias</option>
              <option value="exito">🏆 Éxitos</option>
              <option value="info">💡 Informativas</option>
              <option value="consejo">💭 Consejos</option>
            </select>
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {alertasFiltradas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-4">🔔</div>
              <h2 className="text-3xl font-bold text-white mb-4">No hay alertas</h2>
              <p className="text-gray-400">¡Todo bajo control! No tienes alertas pendientes.</p>
            </div>
          ) : (
            alertasFiltradas.map((alerta) => (
              <div
                key={alerta.id}
                className={`bg-gradient-to-r ${getTipoColor(alerta.tipo)} ${
                  alerta.leida ? 'opacity-50' : ''
                } rounded-xl p-6 border-2 hover:scale-[1.02] transition shadow-xl`}
              >
                <div className="flex items-start gap-4">
                  {/* Icono */}
                  <div className="text-5xl flex-shrink-0">{alerta.icono}</div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
                          {alerta.categoria}
                        </span>
                        <h3 className="text-xl font-bold text-white">{alerta.titulo}</h3>
                      </div>
                      <span className="text-sm text-white/70">
                        {new Date(alerta.fecha).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <p className="text-white/90 mb-4">{alerta.mensaje}</p>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      {alerta.accion && (
                        <a
                          href={alerta.accion}
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                        >
                          Ver detalles →
                        </a>
                      )}
                      {!alerta.leida && (
                        <button
                          onClick={() => marcarLeida(alerta.id)}
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                        >
                          ✓ Marcar leída
                        </button>
                      )}
                      <button
                        onClick={() => eliminarAlerta(alerta.id)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
