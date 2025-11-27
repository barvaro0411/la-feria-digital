import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerMetas, agregarFondosMeta, actualizarMeta, eliminarMeta } from '../servicios/finanzasApi';

export default function Metas() {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [metaSeleccionada, setMetaSeleccionada] = useState(null);
  const [montoAgregar, setMontoAgregar] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarMetas();
  }, [filtro]);

  const cargarMetas = async () => {
    try {
      setLoading(true);
      const estado = filtro === 'todas' ? null : filtro;
      const res = await obtenerMetas(estado);
      setMetas(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error cargando metas:', err);
      setMetas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarFondos = async (e) => {
    e.preventDefault();
    if (!metaSeleccionada || !montoAgregar) return;

    try {
      await agregarFondosMeta(metaSeleccionada._id, parseFloat(montoAgregar));
      setMensaje('✅ Fondos agregados exitosamente');
      setMetaSeleccionada(null);
      setMontoAgregar('');
      cargarMetas();
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setMensaje('❌ Error al agregar fondos');
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarMeta(id, { estado: nuevoEstado });
      setMensaje(`✅ Meta marcada como ${nuevoEstado}`);
      cargarMetas();
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setMensaje('❌ Error al actualizar meta');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return;
    
    try {
      await eliminarMeta(id);
      setMensaje('✅ Meta eliminada');
      cargarMetas();
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setMensaje('❌ Error al eliminar meta');
    }
  };

  const metasActivas = metas.filter(m => m.estado === 'activa');
  const metasCompletadas = metas.filter(m => m.estado === 'completada');
  const totalObjetivo = metasActivas.reduce((sum, m) => sum + (m.montoObjetivo || 0), 0);
  const totalAhorrado = metasActivas.reduce((sum, m) => sum + (m.montoActual || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">🎯 Metas de Ahorro</h1>
        <Link
          to="/metas/nueva"
          className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition"
        >
          + Nueva Meta
        </Link>
      </div>

      {mensaje && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          {mensaje}
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm opacity-90 mb-1">Metas Activas</div>
          <div className="text-2xl font-bold">{metasActivas.length}</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm opacity-90 mb-1">Total Ahorrado</div>
          <div className="text-2xl font-bold">${totalAhorrado.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-sm opacity-90 mb-1">Objetivo Total</div>
          <div className="text-2xl font-bold">${totalObjetivo.toLocaleString()}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-panda-card rounded-lg shadow-md p-4 mb-6 border border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filtro === 'todas' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('activa')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filtro === 'activa' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFiltro('completada')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filtro === 'completada' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completadas
          </button>
        </div>
      </div>

      {/* Lista de Metas */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando metas...</div>
      ) : metas.length === 0 ? (
        <div className="text-center py-12 bg-panda-card rounded-lg shadow-md p-8 border border-gray-700">
          <p className="text-gray-400 mb-4">No hay metas registradas.</p>
          <Link 
            to="/metas/nueva" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition"
          >
            + Crear primera meta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metas.map((meta) => (
            <div 
              key={meta._id} 
              className={`bg-panda-card rounded-lg shadow-lg p-6 border-l-4 ${
                meta.estado === 'completada' ? 'border-green-500' : 
                meta.progreso >= 75 ? 'border-blue-500' : 'border-yellow-500'
              } border border-gray-700`}
            >
              {/* Header de la meta */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{meta.icono || '🎯'}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{meta.nombre}</h3>
                    <p className="text-sm text-gray-400">{meta.categoria}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  meta.estado === 'completada' ? 'bg-green-500/20 text-green-400' :
                  meta.estado === 'pausada' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {meta.estado === 'completada' ? '✅ Completada' :
                   meta.estado === 'pausada' ? '⏸️ Pausada' : '🎯 Activa'}
                </span>
              </div>

              {/* Descripción */}
              {meta.descripcion && (
                <p className="text-sm text-gray-400 mb-4">{meta.descripcion}</p>
              )}

              {/* Progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-semibold">
                    ${meta.montoActual?.toLocaleString() || 0}
                  </span>
                  <span className="text-gray-400">
                    ${meta.montoObjetivo?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-1">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      meta.progreso >= 100 ? 'bg-green-500' :
                      meta.progreso >= 75 ? 'bg-blue-500' :
                      meta.progreso >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(meta.progreso || 0, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{meta.progreso || 0}% completado</span>

                  {meta.fechaLimite && (
                    <span className="text-gray-400">
                      Límite: {new Date(meta.fechaLimite).toLocaleDateString('es-CL')}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 flex-wrap">
                {meta.estado === 'activa' && (
                  <>
                    <button
                      onClick={() => setMetaSeleccionada(meta)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      💰 Agregar Fondos
                    </button>
                    {meta.progreso >= 100 && (
                      <button
                        onClick={() => handleCambiarEstado(meta._id, 'completada')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                      >
                        ✅ Marcar Completada
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => handleEliminar(meta._id)}
                  className="bg-red-600/20 text-red-400 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600/30 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar fondos */}
      {metaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-panda-card rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">
              💰 Agregar Fondos a: {metaSeleccionada.nombre}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                Actual: ${metaSeleccionada.montoActual?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Objetivo: ${metaSeleccionada.montoObjetivo?.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleAgregarFondos}>
              <label className="block text-sm font-medium mb-2 text-gray-300">Monto a agregar</label>
              <input
                type="number"
                value={montoAgregar}
                onChange={(e) => setMontoAgregar(e.target.value)}
                placeholder="Ej: 50000"
                className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
                min="1"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMetaSeleccionada(null);
                    setMontoAgregar('');
                  }}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-md font-semibold hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
