import { useState, useEffect } from 'react';
import { obtenerEstadisticas, obtenerMetas, obtenerPresupuestoActual } from '../servicios/finanzasApi';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

      const [statsRes, metasRes, presupuestoRes] = await Promise.all([
        obtenerEstadisticas(mes, anio),
        obtenerMetas('activa'),
        obtenerPresupuestoActual()
      ]);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const totalIngresos = estadisticas?.resumen?.find(r => r._id === 'ingreso')?.total || 0;
  const totalGastos = estadisticas?.resumen?.find(r => r._id === 'gasto')?.total || 0;
  const balance = totalIngresos - totalGastos;
  const totalAhorro = estadisticas?.ahorroTotal || 0;

  // Datos para gráfico de dona (Gastos por categoría) - MEJORADO
  const categoriasData = estadisticas?.porCategoria || [];
  const doughnutChartData = {
    labels: categoriasData.map(cat => cat._id),
    datasets: [
      {
        label: 'Gastos',
        data: categoriasData.map(cat => cat.total),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  // Datos para gráfico de barras (Ingresos vs Gastos)
  const barChartData = {
    labels: ['Este Mes'],
    datasets: [
      {
        label: 'Ingresos',
        data: [totalIngresos],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 10,
      },
      {
        label: 'Gastos',
        data: [totalGastos],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 10,
      },
      {
        label: 'Ahorro',
        data: [totalAhorro],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  // Datos para gráfico de líneas (Evolución - simulado por ahora)
  const ultimosMeses = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const lineChartData = {
    labels: ultimosMeses,
    datasets: [
      {
        label: 'Ingresos',
        data: [totalIngresos * 0.8, totalIngresos * 0.9, totalIngresos * 0.85, totalIngresos * 0.95, totalIngresos * 1.1, totalIngresos],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Gastos',
        data: [totalGastos * 0.7, totalGastos * 0.85, totalGastos * 0.9, totalGastos * 1.05, totalGastos * 0.95, totalGastos],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: {
            size: 13,
            weight: 'bold'
          },
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += '$' + context.parsed.toLocaleString();
            
            // Agregar porcentaje en gráfico de dona
            if (context.chart.config.type === 'doughnut') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              label += ` (${percentage}%)`;
            }
            return label;
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'right',
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#fff',
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'K';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-5xl">💰</span>
            Dashboard Financiero
          </h1>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Última actualización</p>
            <p className="text-white font-semibold">{new Date().toLocaleDateString('es-CL')}</p>
          </div>
        </div>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TarjetaEstadistica
            titulo="Ingresos"
            valor={`$${totalIngresos.toLocaleString()}`}
            icono="💵"
            color="green"
            tendencia="+12%"
          />
          <TarjetaEstadistica
            titulo="Gastos"
            valor={`$${totalGastos.toLocaleString()}`}
            icono="💸"
            color="red"
            tendencia="-5%"
          />
          <TarjetaEstadistica
            titulo="Balance"
            valor={`$${balance.toLocaleString()}`}
            icono={balance >= 0 ? "✅" : "⚠️"}
            color={balance >= 0 ? "green" : "red"}
            tendencia={balance >= 0 ? "+8%" : "-3%"}
          />
          <TarjetaEstadistica
            titulo="Ahorro Total"
            valor={`$${totalAhorro.toLocaleString()}`}
            icono="🎯"
            color="blue"
            tendencia="+15%"
          />
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Dona - Gastos por Categoría */}
          {categoriasData.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🍩 Gastos por Categoría
                </h2>
                <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full font-bold">
                  {categoriasData.length} categorías
                </span>
              </div>
              <div className="h-80 relative">
                <Doughnut data={doughnutChartData} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">${(totalGastos / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-400 font-semibold">Total Gastos</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de Barras - Resumen Financiero */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📊 Resumen del Mes
              </h2>
              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                Noviembre 2025
              </span>
            </div>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Gráfico de Líneas - Evolución Temporal */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700 hover:border-green-500 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📈 Evolución Últimos 6 Meses
            </h2>
            <div className="flex gap-2">
              <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                Ingresos
              </span>
              <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                Gastos
              </span>
            </div>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Presupuesto del Mes */}
        {presupuesto && presupuesto.categorias?.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                💼 Presupuesto del Mes
              </h2>
              <Link to="/presupuesto" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold">
                Ver detalles →
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span className="font-semibold">Total: ${presupuesto.totalGastado?.toLocaleString()} / ${presupuesto.totalPresupuesto?.toLocaleString()}</span>
                <span className="font-bold text-xl">{presupuesto.porcentajeUsado}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 shadow-lg ${
                    parseFloat(presupuesto.porcentajeUsado) > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    parseFloat(presupuesto.porcentajeUsado) > 75 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${Math.min(presupuesto.porcentajeUsado, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presupuesto.categorias?.map((cat, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-all hover:scale-105">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-white">{cat.nombre}</span>
                    <span className="text-sm font-bold text-blue-400">{((cat.gastado / cat.limite) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span className="font-bold">${cat.gastado?.toLocaleString()}</span>
                    <span>${cat.limite?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5 shadow-inner">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        (cat.gastado / cat.limite) > 0.9 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        (cat.gastado / cat.limite) > 0.75 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${Math.min((cat.gastado / cat.limite) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas Activas con Mini Gráficos */}
        {metas.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🎯 Metas de Ahorro
              </h2>
              <Link to="/metas" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold">
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metas.slice(0, 3).map((meta) => (
                <div key={meta._id} className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-xl p-5 hover:scale-105 transition-all hover:border-purple-500">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-white">
                      {meta.icono} {meta.nombre}
                    </span>
                    <span className="text-lg font-bold text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full">
                      {meta.progreso}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300 mb-3">
                    <span className="font-bold text-lg">${meta.montoActual?.toLocaleString()}</span>
                    <span className="text-gray-400">${meta.montoObjetivo?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${Math.min(parseFloat(meta.progreso), 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    Faltan ${(meta.montoObjetivo - meta.montoActual).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/transacciones/nueva"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">➕</div>
            <div className="font-bold text-lg">Nueva Transacción</div>
            <p className="text-xs opacity-80 mt-1">Registrar ingreso o gasto</p>
          </Link>

          <Link
            to="/transacciones"
            className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">📋</div>
            <div className="font-bold text-lg">Ver Transacciones</div>
            <p className="text-xs opacity-80 mt-1">Historial completo</p>
          </Link>

          <Link
            to="/metas"
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">🎯</div>
            <div className="font-bold text-lg">Mis Metas</div>
            <p className="text-xs opacity-80 mt-1">Objetivos de ahorro</p>
          </Link>

          <Link
            to="/presupuesto"
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">📊</div>
            <div className="font-bold text-lg">Mi Presupuesto</div>
            <p className="text-xs opacity-80 mt-1">Control mensual</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para tarjetas mejorado
function TarjetaEstadistica({ titulo, valor, icono, color, tendencia }) {
  const colores = {
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`relative bg-gradient-to-r ${colores[color]} text-white rounded-2xl shadow-xl p-6 hover:scale-105 transform transition-all overflow-hidden group`}>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="text-5xl transform group-hover:scale-110 transition-transform">{icono}</div>
          {tendencia && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-bold">
              {tendencia}
            </span>
          )}
        </div>
        <div className="text-sm opacity-90 mb-2 font-semibold">{titulo}</div>
        <div className="text-3xl font-bold">{valor}</div>
      </div>
    </div>
  );
}
