import { useState, useEffect } from 'react';
import { obtenerEstadisticas, obtenerMetas, obtenerPresupuestoActual } from '../servicios/finanzasApi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [metas, setMetas] = useState([]);
  const [presupuesto, setPresupuesto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const fecha = new Date();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      console.log('Cargando datos para:', mes, anio);

      const [statsRes, metasRes, presupuestoRes] = await Promise.all([
        obtenerEstadisticas(mes, anio),
        obtenerMetas('activa'),
        obtenerPresupuestoActual()
      ]);

      console.log('Estadísticas recibidas:', statsRes.data);

      setEstadisticas(statsRes.data.data || statsRes.data);
      setMetas(metasRes.data.data || metasRes.data || []);
      setPresupuesto(presupuestoRes.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalIngresos = estadisticas?.resumen?.find(r => r._id === 'ingreso')?.total || 0;
  const totalGastos = estadisticas?.resumen?.find(r => r._id === 'gasto')?.total || 0;
  const balance = totalIngresos - totalGastos;
  const totalAhorro = estadisticas?.ahorroTotal || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">💰 Dashboard Financiero</h1>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <TarjetaEstadistica
          titulo="Ingresos"
          valor={`$${totalIngresos.toLocaleString()}`}
          icono="💵"
          color="green"
        />
        <TarjetaEstadistica
          titulo="Gastos"
          valor={`$${totalGastos.toLocaleString()}`}
          icono="💸"
          color="red"
        />
        <TarjetaEstadistica
          titulo="Balance"
          valor={`$${balance.toLocaleString()}`}
          icono={balance >= 0 ? "✅" : "⚠️"}
          color={balance >= 0 ? "green" : "red"}
        />
        <TarjetaEstadistica
          titulo="Ahorro Total"
          valor={`$${totalAhorro.toLocaleString()}`}
          icono="🎯"
          color="blue"
        />
      </div>

      {/* Presupuesto del Mes */}
      {presupuesto && presupuesto.categorias?.length > 0 && (
        <div className="bg-panda-card rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">📊 Presupuesto del Mes</h2>
            <Link to="/presupuesto" className="text-blue-400 hover:text-blue-300 hover:underline">
              Ver detalles
            </Link>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2 text-gray-300">
              <span>Total: ${presupuesto.totalGastado?.toLocaleString()} / ${presupuesto.totalPresupuesto?.toLocaleString()}</span>
              <span>{presupuesto.porcentajeUsado}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  parseFloat(presupuesto.porcentajeUsado) > 90 ? 'bg-red-500' :
                  parseFloat(presupuesto.porcentajeUsado) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(presupuesto.porcentajeUsado, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            {presupuesto.categorias?.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm text-gray-300">
                <span className="font-medium">{cat.nombre}</span>
                <span>${cat.gastado?.toLocaleString()} / ${cat.limite?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metas Activas */}
      {metas.length > 0 && (
        <div className="bg-panda-card rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🎯 Metas de Ahorro</h2>
            <Link to="/metas" className="text-blue-400 hover:text-blue-300 hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-4">
            {metas.slice(0, 3).map((meta) => (
              <div key={meta._id} className="border-l-4 border-blue-500 pl-4 bg-gray-800 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{meta.icono} {meta.nombre}</span>
                  <span className="text-sm text-gray-400">{meta.progreso}%</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>${meta.montoActual?.toLocaleString()}</span>
                  <span>${meta.montoObjetivo?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(parseFloat(meta.progreso), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gastos por Categoría */}
      {estadisticas?.porCategoria?.length > 0 && (
        <div className="bg-panda-card rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">📈 Gastos por Categoría</h2>
          <div className="space-y-3">
            {estadisticas.porCategoria.slice(0, 5).map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-300">{cat._id}</span>
                  <span className="text-gray-300">${cat.total?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${totalGastos > 0 ? (cat.total / totalGastos * 100).toFixed(0) : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Link
          to="/transacciones/nueva"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">➕</div>
          <div className="font-bold">Nueva Transacción</div>
        </Link>

        <Link
          to="/transacciones"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">📋</div>
          <div className="font-bold">Ver Transacciones</div>
        </Link>

        <Link
          to="/metas"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">🎯</div>
          <div className="font-bold">Mis Metas</div>
        </Link>

        <Link
          to="/presupuesto"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">📊</div>
          <div className="font-bold">Mi Presupuesto</div>
        </Link>
      </div>
    </div>
  );
}

// Componente auxiliar para tarjetas
function TarjetaEstadistica({ titulo, valor, icono, color }) {
  const colores = {
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-r ${colores[color]} text-white rounded-lg shadow-md p-6`}>
      <div className="text-3xl mb-2">{icono}</div>
      <div className="text-sm opacity-90 mb-1">{titulo}</div>
      <div className="text-2xl font-bold">{valor}</div>
    </div>
  );
}
