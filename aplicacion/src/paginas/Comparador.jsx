import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Comparador() {
  const [productos, setProductos] = useState([]);
  const [productoActual, setProductoActual] = useState({
    nombre: '',
    tienda1: { nombre: '', precio: '', enlace: '' },
    tienda2: { nombre: '', precio: '', enlace: '' },
    tienda3: { nombre: '', precio: '', enlace: '' },
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('nombre');

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    
    const tiendas = [productoActual.tienda1, productoActual.tienda2, productoActual.tienda3]
      .filter(t => t.nombre && t.precio);
    
    if (tiendas.length === 0) {
      alert('Debes agregar al menos una tienda con precio');
      return;
    }

    const mejorPrecio = Math.min(...tiendas.map(t => parseFloat(t.precio)));
    const peorPrecio = Math.max(...tiendas.map(t => parseFloat(t.precio)));
    const ahorro = peorPrecio - mejorPrecio;
    const porcentajeAhorro = ((ahorro / peorPrecio) * 100).toFixed(1);

    const nuevoProducto = {
      id: Date.now(),
      nombre: productoActual.nombre,
      tiendas,
      mejorPrecio,
      peorPrecio,
      ahorro,
      porcentajeAhorro,
      fecha: new Date(),
    };

    setProductos([...productos, nuevoProducto]);
    setProductoActual({
      nombre: '',
      tienda1: { nombre: '', precio: '', enlace: '' },
      tienda2: { nombre: '', precio: '', enlace: '' },
      tienda3: { nombre: '', precio: '', enlace: '' },
    });
    setMostrarFormulario(false);
    alert('✅ Producto agregado exitosamente');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta comparación?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (tienda, campo, valor) => {
    setProductoActual({
      ...productoActual,
      [tienda]: {
        ...productoActual[tienda],
        [campo]: valor
      }
    });
  };

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter(p => {
      if (!busqueda) return true;
      const busquedaLower = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.tiendas.some(t => t.nombre.toLowerCase().includes(busquedaLower))
      );
    })
    .sort((a, b) => {
      switch (ordenar) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'ahorro':
          return b.ahorro - a.ahorro;
        case 'precio':
          return a.mejorPrecio - b.mejorPrecio;
        case 'reciente':
          return b.fecha - a.fecha;
        default:
          return 0;
      }
    });

  // Calcular estadísticas
  const totalProductos = productos.length;
  const ahorroTotal = productos.reduce((sum, p) => sum + p.ahorro, 0);
  const promedioAhorro = totalProductos > 0 ? (ahorroTotal / totalProductos).toFixed(0) : 0;
  const mejorAhorro = productos.length > 0 ? Math.max(...productos.map(p => p.ahorro)) : 0;

  // Datos para gráfico de barras (Top 5 ahorros)
  const top5Ahorros = [...productos]
    .sort((a, b) => b.ahorro - a.ahorro)
    .slice(0, 5);

  const barChartData = {
    labels: top5Ahorros.map(p => p.nombre.length > 20 ? p.nombre.substring(0, 20) + '...' : p.nombre),
    datasets: [{
      label: 'Ahorro ($)',
      data: top5Ahorros.map(p => p.ahorro),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderRadius: 10,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => 'Ahorro: $' + context.parsed.y.toLocaleString()
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          callback: value => '$' + value.toLocaleString()
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-5xl">⚖️</span>
              Comparador de Precios
            </h1>
            <p className="text-gray-400 mt-2">
              Compara precios y ahorra dinero en tus compras
            </p>
          </div>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg hover:scale-105 transform flex items-center gap-2"
          >
            {mostrarFormulario ? '❌ Cancelar' : '+ Comparar Producto'}
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-sm opacity-90 mb-1">Productos Comparados</div>
            <div className="text-3xl font-bold">{totalProductos}</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-sm opacity-90 mb-1">Ahorro Total</div>
            <div className="text-3xl font-bold">${ahorroTotal.toLocaleString()}</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm opacity-90 mb-1">Promedio de Ahorro</div>
            <div className="text-3xl font-bold">${promedioAhorro.toLocaleString()}</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-sm opacity-90 mb-1">Mejor Ahorro</div>
            <div className="text-3xl font-bold">${mejorAhorro.toLocaleString()}</div>
          </div>
        </div>

        {/* Gráfico de Top Ahorros */}
        {productos.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📊 Top 5 Productos con Mayor Ahorro
            </h2>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-8 border border-green-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              ⚖️ Comparar Nuevo Producto
            </h2>
            <form onSubmit={handleAgregarProducto}>
              {/* Nombre del producto */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  value={productoActual.nombre}
                  onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
                  required
                  placeholder="Ej: iPhone 15 Pro 256GB"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Tiendas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Tienda 1 */}
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    🏪 Tienda 1 *
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre de la tienda"
                      value={productoActual.tienda1.nombre}
                      onChange={(e) => handleInputChange('tienda1', 'nombre', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={productoActual.tienda1.precio}
                        onChange={(e) => handleInputChange('tienda1', 'precio', e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="URL (opcional)"
                      value={productoActual.tienda1.enlace}
                      onChange={(e) => handleInputChange('tienda1', 'enlace', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>

                {/* Tienda 2 */}
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    🏬 Tienda 2
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre de la tienda"
                      value={productoActual.tienda2.nombre}
                      onChange={(e) => handleInputChange('tienda2', 'nombre', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={productoActual.tienda2.precio}
                        onChange={(e) => handleInputChange('tienda2', 'precio', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="URL (opcional)"
                      value={productoActual.tienda2.enlace}
                      onChange={(e) => handleInputChange('tienda2', 'enlace', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>

                {/* Tienda 3 */}
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    🏢 Tienda 3
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre de la tienda"
                      value={productoActual.tienda3.nombre}
                      onChange={(e) => handleInputChange('tienda3', 'nombre', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={productoActual.tienda3.precio}
                        onChange={(e) => handleInputChange('tienda3', 'precio', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="URL (opcional)"
                      value={productoActual.tienda3.enlace}
                      onChange={(e) => handleInputChange('tienda3', 'enlace', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg"
                >
                  ✅ Guardar Comparación
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

        {/* Filtros */}
        {!mostrarFormulario && productos.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="🔍 Buscar producto o tienda..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nombre">Ordenar por: Nombre</option>
                <option value="ahorro">Ordenar por: Mayor Ahorro</option>
                <option value="precio">Ordenar por: Menor Precio</option>
                <option value="reciente">Ordenar por: Más Reciente</option>
              </select>
            </div>
          </div>
        )}

        {/* Lista de Productos */}
        <div className="space-y-6">
          {productosFiltrados.length === 0 && !mostrarFormulario ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-4">⚖️</div>
              <h2 className="text-3xl font-bold text-white mb-4">No hay comparaciones</h2>
              <p className="text-gray-400 mb-8">Comienza comparando precios para ahorrar dinero</p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
              >
                <span className="text-2xl">+</span>
                Comparar Primer Producto
              </button>
            </div>
          ) : (
            productosFiltrados.map((producto) => {
              const tiendaMasBarata = producto.tiendas.find(t => parseFloat(t.precio) === producto.mejorPrecio);
              const tiendaMasCara = producto.tiendas.find(t => parseFloat(t.precio) === producto.peorPrecio);

              return (
                <div
                  key={producto.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-green-500 transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{producto.nombre}</h3>
                      <p className="text-gray-400 text-sm">
                        Agregado: {new Date(producto.fecha).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminar(producto.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-bold"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  {/* Resumen de Ahorro */}
                  <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border-2 border-green-500 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-300 text-sm mb-1">💰 Ahorro Posible</p>
                        <p className="text-4xl font-bold text-green-400">${producto.ahorro.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm mb-1">📊 Porcentaje</p>
                        <p className="text-4xl font-bold text-green-400">{producto.porcentajeAhorro}%</p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm mb-1">🏆 Mejor Precio</p>
                        <p className="text-4xl font-bold text-white">${producto.mejorPrecio.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Comparación de Tiendas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {producto.tiendas.map((tienda, index) => {
                      const esMasBarata = parseFloat(tienda.precio) === producto.mejorPrecio;
                      const esMasCara = parseFloat(tienda.precio) === producto.peorPrecio;
                      
                      return (
                        <div
                          key={index}
                          className={`relative rounded-xl p-5 border-2 transition ${
                            esMasBarata
                              ? 'bg-green-600/20 border-green-500'
                              : esMasCara
                              ? 'bg-red-600/20 border-red-500'
                              : 'bg-gray-700/50 border-gray-600'
                          }`}
                        >
                          {esMasBarata && (
                            <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              🏆 MEJOR PRECIO
                            </div>
                          )}
                          {esMasCara && (
                            <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              💸 MÁS CARO
                            </div>
                          )}
                          
                          <p className="text-white font-bold text-lg mb-2">{tienda.nombre}</p>
                          <p className={`text-3xl font-bold mb-4 ${
                            esMasBarata ? 'text-green-400' : esMasCara ? 'text-red-400' : 'text-white'
                          }`}>
                            ${parseFloat(tienda.precio).toLocaleString()}
                          </p>
                          
                          {tienda.enlace && (
                            <a
                              href={tienda.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                            >
                              🔗 Ver en tienda →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Consejos */}
        {productos.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              💡 Consejos para Ahorrar
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Siempre compara precios antes de comprar productos costosos</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Considera costos de envío y tiempos de entrega al comparar</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Usa los cupones de NubiAI para obtener descuentos adicionales</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Revisa las políticas de devolución de cada tienda</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
