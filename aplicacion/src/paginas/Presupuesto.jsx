import { useState, useEffect } from 'react';
import { obtenerPresupuestoActual, crearPresupuesto, actualizarPresupuesto, registrarEvento } from '../servicios/finanzasApi';
import { Link } from 'react-router-dom';
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
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const categoriasComunes = [
  { nombre: 'Alimentación', icono: '🍔', color: 'from-orange-500 to-orange-600' },
  { nombre: 'Transporte', icono: '🚗', color: 'from-blue-500 to-blue-600' },
  { nombre: 'Vivienda', icono: '🏠', color: 'from-green-500 to-green-600' },
  { nombre: 'Entretenimiento', icono: '🎮', color: 'from-purple-500 to-purple-600' },
  { nombre: 'Salud', icono: '💊', color: 'from-red-500 to-red-600' },
  { nombre: 'Educación', icono: '📚', color: 'from-indigo-500 to-indigo-600' },
  { nombre: 'Servicios', icono: '💡', color: 'from-yellow-500 to-yellow-600' },
  { nombre: 'Otros', icono: '📦', color: 'from-gray-500 to-gray-600' },
];

export default function Presupuesto() {
  const [presupuesto, setPresupuesto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categorias, setCategorias] = useState(
    categoriasComunes.map(cat => ({ ...cat, limite: 0 }))
  );

  // 🔹 NUEVO: registrar visita a Presupuesto
  useEffect(() => {
    registrarEvento('visita_presupuesto');
  }, []);


  useEffect(() => {
    cargarPresupuesto();
  }, []);

  const cargarPresupuesto = async () => {
    try {
      const res = await obtenerPresupuestoActual();
      if (res.data && res.data.categorias && res.data.categorias.length > 0) {
        setPresupuesto(res.data);
        setMostrarFormulario(false);
      } else {
        setMostrarFormulario(true);
      }
    } catch (error) {
      console.error('Error cargando presupuesto:', error);
      setMostrarFormulario(true);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoriasConLimite = categorias.filter(cat => cat.limite > 0);
      
      if (categoriasConLimite.length === 0) {
        alert('Debes establecer al menos una categoría con límite');
        return;
      }

      const datos = {
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear(),
        categorias: categoriasConLimite.map(cat => ({
          nombre: cat.nombre,
          limite: parseFloat(cat.limite)
        }))
      };

      if (presupuesto?._id) {
        await actualizarPresupuesto(presupuesto._id, datos);
      } else {
        await crearPresupuesto(datos);
      }

      await cargarPresupuesto();
      alert('✅ Presupuesto guardado exitosamente');
    } catch (error) {
      console.error('Error guardando presupuesto:', error);
      alert('❌ Error al guardar presupuesto');
    }
  };

  const handleLimiteChange = (index, valor) => {
    const nuevasCategorias = [...categorias];
    nuevasCategorias[index].limite = valor;
    setCategorias(nuevasCategorias);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  // Datos para gráficos
  const doughnutData = presupuesto ? {
    labels: presupuesto.categorias.map(cat => cat.nombre),
    datasets: [{
      data: presupuesto.categorias.map(cat => cat.gastado),
      backgroundColor: categoriasComunes.map(cat => cat.color.split(' ')[1].replace('to-', '')).map(color => {
        const colorMap = {
          'orange-600': 'rgba(234, 88, 12, 0.8)',
          'blue-600': 'rgba(37, 99, 235, 0.8)',
          'green-600': 'rgba(22, 163, 74, 0.8)',
          'purple-600': 'rgba(147, 51, 234, 0.8)',
          'red-600': 'rgba(220, 38, 38, 0.8)',
          'indigo-600': 'rgba(79, 70, 229, 0.8)',
          'yellow-600': 'rgba(202, 138, 4, 0.8)',
          'gray-600': 'rgba(75, 85, 99, 0.8)',
        };
        return colorMap[color] || 'rgba(156, 163, 175, 0.8)';
      }),
      borderWidth: 3,
      borderColor: '#1f2937',
    }]
  } : null;

  const barData = presupuesto ? {
    labels: presupuesto.categorias.map(cat => cat.nombre),
    datasets: [
      {
        label: 'Gastado',
        data: presupuesto.categorias.map(cat => cat.gastado),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Disponible',
        data: presupuesto.categorias.map(cat => Math.max(cat.limite - cat.gastado, 0)),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 8,
      }
    ]
  } : null;

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
          label: function(context) {
            return context.label + ': $' + context.parsed.toLocaleString();
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#fff' },
        grid: { display: false }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: '#fff',
          callback: value => '$' + value.toLocaleString()
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-5xl">💼</span>
              Presupuesto Mensual
            </h1>
            <p className="text-gray-400 mt-2">
              {new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:from-purple-600 hover:to-purple-700 transition shadow-lg hover:scale-105 transform"
          >
            {mostrarFormulario ? '❌ Cancelar' : '✏️ Editar Presupuesto'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📝 Configurar Presupuesto
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {categorias.map((cat, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-purple-400 transition">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{cat.icono}</span>
                      <label className="text-white font-semibold flex-1">{cat.nombre}</label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        value={cat.limite}
                        onChange={(e) => handleLimiteChange(index, e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-lg"
                >
                  💾 Guardar Presupuesto
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-8 bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resumen General */}
        {presupuesto && !mostrarFormulario && (
          <>
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-sm opacity-90 mb-1">Presupuesto Total</div>
                <div className="text-3xl font-bold">${presupuesto.totalPresupuesto?.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
                <div className="text-4xl mb-2">💸</div>
                <div className="text-sm opacity-90 mb-1">Total Gastado</div>
                <div className="text-3xl font-bold">${presupuesto.totalGastado?.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
                <div className="text-4xl mb-2">💵</div>
                <div className="text-sm opacity-90 mb-1">Disponible</div>
                <div className="text-3xl font-bold">${(presupuesto.totalPresupuesto - presupuesto.totalGastado).toLocaleString()}</div>
              </div>
              <div className={`bg-gradient-to-r ${parseFloat(presupuesto.porcentajeUsado) > 90 ? 'from-red-500 to-red-600' : parseFloat(presupuesto.porcentajeUsado) > 75 ? 'from-yellow-500 to-yellow-600' : 'from-purple-500 to-purple-600'} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition`}>
                <div className="text-4xl mb-2">📊</div>
                <div className="text-sm opacity-90 mb-1">Uso del Presupuesto</div>
                <div className="text-3xl font-bold">{presupuesto.porcentajeUsado}%</div>
              </div>
            </div>

            {/* Alertas */}
            {parseFloat(presupuesto.porcentajeUsado) > 75 && (
              <div className={`${parseFloat(presupuesto.porcentajeUsado) > 90 ? 'bg-red-500/20 border-red-500' : 'bg-yellow-500/20 border-yellow-500'} border-2 rounded-xl p-6 mb-8`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{parseFloat(presupuesto.porcentajeUsado) > 90 ? '🚨' : '⚠️'}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {parseFloat(presupuesto.porcentajeUsado) > 90 ? '¡Alerta Crítica!' : '⚠️ Advertencia'}
                    </h3>
                    <p className="text-gray-200">
                      {parseFloat(presupuesto.porcentajeUsado) > 90 
                        ? 'Has usado más del 90% de tu presupuesto mensual. Te recomendamos reducir gastos innecesarios.'
                        : 'Has usado más del 75% de tu presupuesto. Considera revisar tus gastos para el resto del mes.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de Dona */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🍩 Distribución de Gastos
                </h2>
                <div className="h-80">
                  <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '65%' }} />
                </div>
              </div>

              {/* Gráfico de Barras */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  📊 Gastado vs Disponible
                </h2>
                <div className="h-80">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>

            {/* Categorías Detalladas */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                📋 Detalle por Categoría
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presupuesto.categorias.map((cat, idx) => {
                  const porcentaje = (cat.gastado / cat.limite) * 100;
                  const categoria = categoriasComunes.find(c => c.nombre === cat.nombre);
                  return (
                    <div key={idx} className={`bg-gradient-to-r ${categoria?.color || 'from-gray-600 to-gray-700'} rounded-xl p-5 text-white shadow-lg hover:scale-105 transition`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{categoria?.icono || '📦'}</span>
                          <span className="font-bold text-lg">{cat.nombre}</span>
                        </div>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-bold">
                          {porcentaje.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Gastado:</span>
                          <span className="font-bold">${cat.gastado?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Límite:</span>
                          <span className="font-bold">${cat.limite?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Disponible:</span>
                          <span className="font-bold">${Math.max(cat.limite - cat.gastado, 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="w-full bg-black/30 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            porcentaje > 100 ? 'bg-white' : 'bg-white/80'
                          }`}
                          style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        ></div>
                      </div>

                      {porcentaje > 100 && (
                        <p className="text-xs mt-2 bg-red-900/50 px-2 py-1 rounded">
                          ⚠️ Límite excedido por ${(cat.gastado - cat.limite).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consejos */}
            <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💡 Consejos para tu Presupuesto
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Revisa tu presupuesto semanalmente para evitar sorpresas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Prioriza categorías esenciales como vivienda y alimentación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Usa los cupones de NubiAI para reducir gastos en entretenimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Ajusta tu presupuesto mensualmente según tus necesidades</span>
                </li>
              </ul>
            </div>

            {/* Botón de acción */}
            <div className="mt-8 text-center">
              <Link
                to="/transacciones/nueva"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg hover:scale-105 transform"
              >
                ➕ Registrar Nueva Transacción
              </Link>
            </div>
          </>
        )}

        {/* Estado vacío */}
        {!presupuesto && !mostrarFormulario && (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">💼</div>
            <h2 className="text-3xl font-bold text-white mb-4">No tienes presupuesto configurado</h2>
            <p className="text-gray-400 mb-8">Crea tu primer presupuesto mensual para controlar tus gastos</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-600 hover:to-purple-700 transition shadow-lg"
            >
              ✨ Crear Presupuesto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
