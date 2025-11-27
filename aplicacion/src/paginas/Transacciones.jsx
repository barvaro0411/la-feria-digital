import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { obtenerTransacciones, eliminarTransaccion } from '../servicios/finanzasApi';

export default function Transacciones() {
  const location = useLocation();
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: ''
  });
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');

  useEffect(() => {
    cargarTransacciones();
  }, [filtros]); // ✅ Recargar cuando cambien los filtros

  // ✅ NUEVO: Limpiar mensaje después de mostrarlo
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const cargarTransacciones = async () => {
  try {
    setLoading(true);
    
    const params = {};
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.categoria) params.categoria = filtros.categoria;
    
    console.log('Cargando transacciones con filtros:', params);
    
    const res = await obtenerTransacciones(params);
    console.log('Respuesta COMPLETA del servidor:', res); // ✅ NUEVO
    console.log('res.data:', res.data); // ✅ NUEVO
    console.log('res.data.data:', res.data.data); // ✅ NUEVO
    
    // ✅ CORREGIDO: Probar diferentes estructuras de respuesta
    const transaccionesRecibidas = res.data.data || res.data || [];
    console.log('Transacciones a mostrar:', transaccionesRecibidas); // ✅ NUEVO
    
    setTransacciones(transaccionesRecibidas);
  } catch (err) {
    console.error('Error cargando transacciones:', err);
    setTransacciones([]);
  } finally {
    setLoading(false);
  }
};

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;
    
    try {
      await eliminarTransaccion(id);
      setMensaje('Transacción eliminada');
      cargarTransacciones();
    } catch (err) {
      alert('Error al eliminar la transacción');
    }
  };

  // Calcular totales (con validación)
  const totalIngresos = Array.isArray(transacciones)
    ? transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + (t.monto || 0), 0)
    : 0;

  const totalGastos = Array.isArray(transacciones)
    ? transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + (t.monto || 0), 0)
    : 0;

  const totalAhorro = Array.isArray(transacciones)
    ? transacciones.reduce((sum, t) => sum + (t.ahorroGenerado || 0), 0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📝 Mis Transacciones</h1>
        <Link
          to="/transacciones/nueva"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          + Nueva Transacción
        </Link>
      </div>

      {mensaje && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ {mensaje}
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-gray-600">Ingresos</p>
          <p className="text-2xl font-bold text-green-600">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-gray-600">Gastos</p>
          <p className="text-2xl font-bold text-red-600">${totalGastos.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-600">Ahorro con Cupones</p>
          <p className="text-2xl font-bold text-blue-600">${totalAhorro.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>

          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white"
          >
            <option value="">Todas las categorías</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Salud">Salud</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Educación">Educación</option>
            <option value="Vivienda">Vivienda</option>
            <option value="Ropa">Ropa</option>
            <option value="Servicios">Servicios</option>
            <option value="Ahorro">Ahorro</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Lista de Transacciones */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Cargando transacciones...</div>
      ) : !Array.isArray(transacciones) || transacciones.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-500 mb-4">No hay transacciones registradas.</p>
          <Link 
            to="/transacciones/nueva" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            + Crear primera transacción
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ahorro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transacciones.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(t.fecha).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{t.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        t.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.tipo === 'ingreso' ? '💵 Ingreso' : '💸 Gasto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ${t.monto.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.ahorroGenerado > 0 && (
                        <span className="text-green-600 font-semibold">
                          +${t.ahorroGenerado.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEliminar(t._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
