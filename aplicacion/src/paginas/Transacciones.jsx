import { useState, useEffect } from 'react';
import { obtenerTransacciones, eliminarTransaccion, registrarEvento } from '../servicios/finanzasApi';
import { Link } from 'react-router-dom';

const categorias = {
  'Alimentación': { icono: '🍔', color: 'from-orange-500 to-orange-600' },
  'Transporte': { icono: '🚗', color: 'from-blue-500 to-blue-600' },
  'Vivienda': { icono: '🏠', color: 'from-green-500 to-green-600' },
  'Entretenimiento': { icono: '🎮', color: 'from-purple-500 to-purple-600' },
  'Salud': { icono: '💊', color: 'from-red-500 to-red-600' },
  'Educación': { icono: '📚', color: 'from-indigo-500 to-indigo-600' },
  'Servicios': { icono: '💡', color: 'from-yellow-500 to-yellow-600' },
  'Compras': { icono: '🛍️', color: 'from-pink-500 to-pink-600' },
  'Tecnología': { icono: '💻', color: 'from-cyan-500 to-cyan-600' },
  'Sueldo': { icono: '💰', color: 'from-emerald-500 to-emerald-600' },
  'Inversión': { icono: '📈', color: 'from-teal-500 to-teal-600' },
  'Otros': { icono: '📦', color: 'from-gray-500 to-gray-600' },
};

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    busqueda: ''
  });
  const [vistaActual, setVistaActual] = useState('grid'); // 'grid' o 'lista'

  // 🔹 NUEVO: registrar visita a Transacciones
  useEffect(() => {
    registrarEvento('visita_transacciones');
  }, []);

  useEffect(() => {
    cargarTransacciones();
  }, [filtros.tipo, filtros.categoria]);


  const cargarTransacciones = async () => {
    try {
      setCargando(true);
      const params = {};
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.categoria) params.categoria = filtros.categoria;

      const res = await obtenerTransacciones(params);
      setTransacciones(res.data.data || res.data || []);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      try {
        await eliminarTransaccion(id);
        cargarTransacciones();
      } catch (error) {
        console.error('Error eliminando transacción:', error);
        alert('Error al eliminar la transacción');
      }
    }
  };

  // Filtrar transacciones por búsqueda
  const transaccionesFiltradas = transacciones.filter(t => {
    if (!filtros.busqueda) return true;
    const busqueda = filtros.busqueda.toLowerCase();
    return (
      t.descripcion?.toLowerCase().includes(busqueda) ||
      t.categoria?.toLowerCase().includes(busqueda) ||
      t.monto?.toString().includes(busqueda)
    );
  });

  // Calcular totales
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balance = totalIngresos - totalGastos;

  // Agrupar por categoría
  const gastosPorCategoria = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((acc, t) => {
      if (!acc[t.categoria]) {
        acc[t.categoria] = { total: 0, cantidad: 0 };
      }
      acc[t.categoria].total += t.monto;
      acc[t.categoria].cantidad += 1;
      return acc;
    }, {});

  const topCategorias = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3);

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando transacciones...</p>
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
              <span className="text-5xl">💳</span>
              Mis Transacciones
            </h1>
            <p className="text-gray-400 mt-2">
              {transaccionesFiltradas.length} {transaccionesFiltradas.length === 1 ? 'transacción' : 'transacciones'} encontradas
            </p>
          </div>
          <Link
            to="/transacciones/nueva"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg hover:scale-105 transform flex items-center gap-2"
          >
            <span className="text-2xl">+</span>
            Nueva Transacción
          </Link>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">💵</div>
            <div className="text-sm opacity-90 mb-1">Total Ingresos</div>
            <div className="text-3xl font-bold">${totalIngresos.toLocaleString()}</div>
            <div className="text-xs opacity-80 mt-1">
              {transacciones.filter(t => t.tipo === 'ingreso').length} transacciones
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">💸</div>
            <div className="text-sm opacity-90 mb-1">Total Gastos</div>
            <div className="text-3xl font-bold">${totalGastos.toLocaleString()}</div>
            <div className="text-xs opacity-80 mt-1">
              {transacciones.filter(t => t.tipo === 'gasto').length} transacciones
            </div>
          </div>

          <div className={`bg-gradient-to-r ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition`}>
            <div className="text-4xl mb-2">{balance >= 0 ? '✅' : '⚠️'}</div>
            <div className="text-sm opacity-90 mb-1">Balance</div>
            <div className="text-3xl font-bold">${balance.toLocaleString()}</div>
            <div className="text-xs opacity-80 mt-1">
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm opacity-90 mb-1">Promedio Gasto</div>
            <div className="text-3xl font-bold">
              ${transacciones.filter(t => t.tipo === 'gasto').length > 0 
                ? Math.round(totalGastos / transacciones.filter(t => t.tipo === 'gasto').length).toLocaleString()
                : '0'}
            </div>
            <div className="text-xs opacity-80 mt-1">Por transacción</div>
          </div>
        </div>

        {/* Top Categorías */}
        {topCategorias.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🏆 Top 3 Categorías de Gasto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategorias.map(([categoria, datos], index) => {
                const catInfo = categorias[categoria] || categorias['Otros'];
                return (
                  <div key={categoria} className={`bg-gradient-to-r ${catInfo.color} rounded-xl p-4 text-white hover:scale-105 transition`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{catInfo.icono}</span>
                      <div className="flex-1">
                        <p className="font-bold">{categoria}</p>
                        <p className="text-xs opacity-80">{datos.cantidad} transacciones</p>
                      </div>
                      <span className="text-2xl font-bold">#{index + 1}</span>
                    </div>
                    <p className="text-2xl font-bold">${datos.total.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por Tipo */}
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="ingreso">💵 Ingresos</option>
              <option value="gasto">💸 Gastos</option>
            </select>

            {/* Filtro por Categoría */}
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {Object.keys(categorias).map(cat => (
                <option key={cat} value={cat}>
                  {categorias[cat].icono} {cat}
                </option>
              ))}
            </select>

            {/* Vista */}
            <div className="flex gap-2">
              <button
                onClick={() => setVistaActual('grid')}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                  vistaActual === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔲 Grid
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                  vistaActual === 'lista'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📋 Lista
              </button>
            </div>
          </div>

          {/* Limpiar filtros */}
          {(filtros.tipo || filtros.categoria || filtros.busqueda) && (
            <button
              onClick={() => setFiltros({ tipo: '', categoria: '', busqueda: '' })}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-semibold"
            >
              🔄 Limpiar filtros
            </button>
          )}
        </div>

        {/* Transacciones - Vista Grid */}
        {vistaActual === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transaccionesFiltradas.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-8xl mb-4">💳</div>
                <h2 className="text-3xl font-bold text-white mb-4">No hay transacciones</h2>
                <p className="text-gray-400 mb-8">Comienza registrando tu primera transacción</p>
                <Link
                  to="/transacciones/nueva"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                >
                  <span className="text-2xl">+</span>
                  Nueva Transacción
                </Link>
              </div>
            ) : (
              transaccionesFiltradas.map((transaccion) => {
                const catInfo = categorias[transaccion.categoria] || categorias['Otros'];
                return (
                  <div
                    key={transaccion._id}
                    className={`bg-gradient-to-br ${
                      transaccion.tipo === 'ingreso'
                        ? 'from-green-600/20 to-green-700/20 border-green-500'
                        : 'from-red-600/20 to-red-700/20 border-red-500'
                    } border-2 rounded-2xl p-6 hover:scale-105 transition shadow-xl`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{catInfo.icono}</span>
                        <div>
                          <p className="text-white font-bold text-lg">{transaccion.descripcion}</p>
                          <p className="text-gray-400 text-sm">{transaccion.categoria}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        transaccion.tipo === 'ingreso'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {transaccion.tipo === 'ingreso' ? '💵' : '💸'} {transaccion.tipo}
                      </span>
                    </div>

                    {/* Monto */}
                    <div className={`text-4xl font-bold mb-4 ${
                      transaccion.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toLocaleString()}
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>📅 {new Date(transaccion.fecha).toLocaleDateString('es-CL')}</span>
                      <span>🕐 {new Date(transaccion.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Acciones */}
                    <button
                      onClick={() => handleEliminar(transaccion._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Transacciones - Vista Lista */}
        {vistaActual === 'lista' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            {transaccionesFiltradas.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-4">💳</div>
                <h2 className="text-3xl font-bold text-white mb-4">No hay transacciones</h2>
                <p className="text-gray-400 mb-8">Comienza registrando tu primera transacción</p>
                <Link
                  to="/transacciones/nueva"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                >
                  <span className="text-2xl">+</span>
                  Nueva Transacción
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-bold">Categoría</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Descripción</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Tipo</th>
                    <th className="px-6 py-4 text-right text-white font-bold">Monto</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Fecha</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesFiltradas.map((transaccion, index) => {
                    const catInfo = categorias[transaccion.categoria] || categorias['Otros'];
                    return (
                      <tr
                        key={transaccion._id}
                        className={`${
                          index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'
                        } hover:bg-gray-700/70 transition`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{catInfo.icono}</span>
                            <span className="text-white font-semibold">{transaccion.categoria}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{transaccion.descripcion}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            transaccion.tipo === 'ingreso'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {transaccion.tipo === 'ingreso' ? '💵 Ingreso' : '💸 Gasto'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold text-xl ${
                          transaccion.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(transaccion.fecha).toLocaleDateString('es-CL')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEliminar(transaccion._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-bold text-sm"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
