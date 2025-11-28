import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { obtenerMetas, eliminarMeta, contribuirMeta, registrarEvento } from '../servicios/finanzasApi';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Metas() {
  const [metas, setMetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('grid');
  const [metaSeleccionada, setMetaSeleccionada] = useState(null);
  const [montoContribucion, setMontoContribucion] = useState('');

  // registrar visita a Metas
  useEffect(() => {
    registrarEvento('visita_metas');
  }, []);

  useEffect(() => {
    cargarMetas();
  }, [filtroEstado]);

  const cargarMetas = async () => {
    try {
      setCargando(true);
      const estado = filtroEstado === 'todas' ? undefined : filtroEstado;
      const res = await obtenerMetas(estado);
      setMetas(res.data.data || res.data || []);
    } catch (error) {
      console.error('Error cargando metas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta meta?')) {
      try {
        await eliminarMeta(id);
        cargarMetas();
      } catch (error) {
        console.error('Error eliminando meta:', error);
        alert('Error al eliminar la meta');
      }
    }
  };

  const handleContribuir = async (e) => {
    e.preventDefault();
    if (!metaSeleccionada || !montoContribucion) return;

    try {
      await contribuirMeta(metaSeleccionada._id, parseFloat(montoContribucion));
      setMetaSeleccionada(null);
      setMontoContribucion('');
      cargarMetas();
      alert('✅ Contribución registrada exitosamente');
    } catch (error) {
      console.error('Error contribuyendo a meta:', error);
      alert('❌ Error al registrar contribución');
    }
  };

  // Filtrar metas por búsqueda
  const metasFiltradas = metas.filter(meta => {
    if (!busqueda) return true;
    const busquedaLower = busqueda.toLowerCase();
    return (
      meta.nombre?.toLowerCase().includes(busquedaLower) ||
      meta.descripcion?.toLowerCase().includes(busquedaLower) ||
      meta.montoObjetivo?.toString().includes(busquedaLower)
    );
  });

  // Calcular estadísticas
  const totalMetas = metas.length;
  const metasActivas = metas.filter(m => m.estado === 'activa').length;
  const metasCompletadas = metas.filter(m => m.estado === 'completada').length;
  const totalAhorrado = metas.reduce((sum, m) => sum + (m.montoActual || 0), 0);
  const totalObjetivo = metas.reduce((sum, m) => sum + m.montoObjetivo, 0);
  const progresoTotal = totalObjetivo > 0 ? ((totalAhorrado / totalObjetivo) * 100).toFixed(1) : 0;

  // Datos para gráfico de dona
  const doughnutData = {
    labels: ['Ahorrado', 'Por Ahorrar'],
    datasets: [{
      data: [totalAhorrado, Math.max(totalObjetivo - totalAhorrado, 0)],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(107, 114, 128, 0.3)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(107, 114, 128, 0.5)',
      ],
      borderWidth: 3,
    }]
  };

  // Datos para gráfico de barras
  const barData = {
    labels: metasFiltradas.slice(0, 5).map(m => m.nombre),
    datasets: [{
      label: 'Progreso',
      data: metasFiltradas.slice(0, 5).map(m => parseFloat(m.progreso)),
      backgroundColor: metasFiltradas.slice(0, 5).map(m =>
        parseFloat(m.progreso) >= 100 ? 'rgba(34, 197, 94, 0.8)' :
        parseFloat(m.progreso) >= 75 ? 'rgba(59, 130, 246, 0.8)' :
        parseFloat(m.progreso) >= 50 ? 'rgba(251, 191, 36, 0.8)' :
        'rgba(239, 68, 68, 0.8)'
      ),
      borderRadius: 10,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: { size: 13, weight: 'bold' },
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.chart.config.type === 'doughnut') {
              return context.label + ': $' + context.parsed.toLocaleString();
            }
            return context.dataset.label + ': ' + context.parsed.toFixed(1) + '%';
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#fff',
          callback: value => value + '%'
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { display: false }
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando metas...</p>
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
              <span className="text-5xl">🎯</span>
              Metas de Ahorro
            </h1>
            <p className="text-gray-400 mt-2">
              {metasFiltradas.length} {metasFiltradas.length === 1 ? 'meta' : 'metas'} • {progresoTotal}% de progreso total
            </p>
          </div>
          <Link
            to="/metas/nueva"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg hover:scale-105 transform flex items-center gap-2"
          >
            <span className="text-2xl">+</span>
            Nueva Meta
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm opacity-90 mb-1">Total Metas</div>
            <div className="text-3xl font-bold">{totalMetas}</div>
            <div className="text-xs opacity-80 mt-1">
              {metasActivas} activas • {metasCompletadas} completadas
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-sm opacity-90 mb-1">Total Ahorrado</div>
            <div className="text-3xl font-bold">${totalAhorrado.toLocaleString()}</div>
            <div className="text-xs opacity-80 mt-1">
              De ${totalObjetivo.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-sm opacity-90 mb-1">Progreso Total</div>
            <div className="text-3xl font-bold">{progresoTotal}%</div>
            <div className="text-xs opacity-80 mt-1">
              {totalObjetivo > totalAhorrado && `Faltan $${(totalObjetivo - totalAhorrado).toLocaleString()}`}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-sm opacity-90 mb-1">Metas Completadas</div>
            <div className="text-3xl font-bold">{metasCompletadas}</div>
            <div className="text-xs opacity-80 mt-1">
              {totalMetas > 0 ? `${((metasCompletadas / totalMetas) * 100).toFixed(0)}% del total` : 'Sin metas aún'}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        {metas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Dona */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🍩 Progreso General
              </h2>
              <div className="h-80 relative">
                <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '70%' }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{progresoTotal}%</p>
                    <p className="text-sm text-gray-400 font-semibold">Completado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barras */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                📊 Top 5 Metas
              </h2>
              <div className="h-80">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar meta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="todas">Todas las metas</option>
              <option value="activa">🟢 Activas</option>
              <option value="completada">✅ Completadas</option>
              <option value="pausada">⏸️ Pausadas</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setVistaActual('grid')}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                  vistaActual === 'grid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔲 Grid
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                  vistaActual === 'lista'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📋 Lista
              </button>
            </div>
          </div>
        </div>

        {/* Vista Grid */}
        {vistaActual === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metasFiltradas.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-8xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-white mb-4">No hay metas</h2>
                <p className="text-gray-400 mb-8">Crea tu primera meta de ahorro</p>
                <Link
                  to="/metas/nueva"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
                >
                  <span className="text-2xl">+</span>
                  Nueva Meta
                </Link>
              </div>
            ) : (
              metasFiltradas.map((meta) => {
                const progreso = parseFloat(meta.progreso);
                const falta = meta.montoObjetivo - (meta.montoActual || 0);
                return (
                  <div
                    key={meta._id}
                    className={`relative bg-gradient-to-br ${
                      meta.estado === 'completada'
                        ? 'from-green-600/20 to-green-700/20 border-green-500'
                        : meta.estado === 'pausada'
                        ? 'from-gray-600/20 to-gray-700/20 border-gray-500'
                        : 'from-blue-600/20 to-purple-600/20 border-blue-500'
                    } border-2 rounded-2xl p-6 hover:scale-105 transition shadow-xl overflow-hidden`}
                  >
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        meta.estado === 'completada'
                          ? 'bg-green-500 text-white'
                          : meta.estado === 'pausada'
                          ? 'bg-gray-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {meta.estado === 'completada' ? '✅' : meta.estado === 'pausada' ? '⏸️' : '🟢'} {meta.estado}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="text-6xl mb-3">{meta.icono}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{meta.nombre}</h3>
                      {meta.descripcion && (
                        <p className="text-gray-400 text-sm">{meta.descripcion}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-3xl font-bold text-white">
                          ${(meta.montoActual || 0).toLocaleString()}
                        </span>
                        <span className="text-xl font-bold text-green-400">{progreso}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mb-3">
                        <span>Objetivo: ${meta.montoObjetivo.toLocaleString()}</span>
                        {falta > 0 && <span>Faltan: ${falta.toLocaleString()}</span>}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            progreso >= 100
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : progreso >= 75
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : progreso >= 50
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${Math.min(progreso, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {meta.fechaLimite && (
                      <div className="mb-4 text-sm text-gray-400">
                        📅 Fecha límite: {new Date(meta.fechaLimite).toLocaleDateString('es-CL')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {meta.estado !== 'completada' && (
                        <button
                          onClick={() => setMetaSeleccionada(meta)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                        >
                          💰 Contribuir
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(meta._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Vista Lista */}
        {vistaActual === 'lista' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            {metasFiltradas.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-white mb-4">No hay metas</h2>
                <p className="text-gray-400 mb-8">Crea tu primera meta de ahorro</p>
                <Link
                  to="/metas/nueva"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
                >
                  <span className="text-2xl">+</span>
                  Nueva Meta
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">Meta</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Estado</th>
                      <th className="px-6 py-4 text-right text-white font-bold">Ahorrado</th>
                      <th className="px-6 py-4 text-right text-white font-bold">Objetivo</th>
                      <th className="px-6 py-4 text-center text-white font-bold">Progreso</th>
                      <th className="px-6 py-4 text-center text-white font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metasFiltradas.map((meta, index) => {
                      const progreso = parseFloat(meta.progreso);
                      return (
                        <tr
                          key={meta._id}
                          className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'} hover:bg-gray-700/70 transition`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{meta.icono}</span>
                              <div>
                                <p className="text-white font-bold">{meta.nombre}</p>
                                {meta.descripcion && (
                                  <p className="text-gray-400 text-sm">{meta.descripcion}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              meta.estado === 'completada'
                                ? 'bg-green-500 text-white'
                                : meta.estado === 'pausada'
                                ? 'bg-gray-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {meta.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-xl text-green-400">
                            ${(meta.montoActual || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-xl text-white">
                            ${meta.montoObjetivo.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-white font-bold text-lg">{progreso}%</span>
                              <div className="w-full bg-gray-600 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all ${
                                    progreso >= 100 ? 'bg-green-500' :
                                    progreso >= 75 ? 'bg-blue-500' :
                                    progreso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(progreso, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              {meta.estado !== 'completada' && (
                                <button
                                  onClick={() => setMetaSeleccionada(meta)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-bold text-sm"
                                >
                                  💰 Contribuir
                                </button>
                              )}
                              <button
                                onClick={() => handleEliminar(meta._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-bold text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal de Contribución */}
        {metaSeleccionada && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                💰 Contribuir a Meta
              </h3>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{metaSeleccionada.icono}</span>
                  <div>
                    <p className="text-xl font-bold text-white">{metaSeleccionada.nombre}</p>
                    <p className="text-gray-400">
                      ${(metaSeleccionada.montoActual || 0).toLocaleString()} / ${metaSeleccionada.montoObjetivo.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleContribuir}>
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">Monto a contribuir</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">$</span>
                    <input
                      type="number"
                      min="1"
                      value={montoContribucion}
                      onChange={(e) => setMontoContribucion(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg"
                  >
                    ✅ Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMetaSeleccionada(null);
                      setMontoContribucion('');
                    }}
                    className="px-6 bg-gray-700 text-white font-bold py-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
