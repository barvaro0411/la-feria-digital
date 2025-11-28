import { useState, useEffect } from 'react';
import { obtenerCodigos } from '../servicios/api';
import { registrarEvento } from '../servicios/finanzasApi';
import { Link } from 'react-router-dom';

export default function Inicio() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('recientes');
  const [cuponSeleccionado, setCuponSeleccionado] = useState(null);

  // 🔹 Registro de navegación: visita cupones
  useEffect(() => {
    registrarEvento('visita_cupones');
  }, []);

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    try {
      setCargando(true);
      const res = await obtenerCodigos();
      const cuponesData = res.data.data || res.data || [];
      if (cuponesData.length === 0) {
        setCupones(cuponesEjemplo);
      } else {
        setCupones(cuponesData);
      }
    } catch (error) {
      console.error('Error cargando cupones:', error);
      setCupones(cuponesEjemplo);
    } finally {
      setCargando(false);
    }
  };

  const cuponesEjemplo = [
    {
      _id: 1,
      titulo: 'Amazon - 20% OFF',
      descripcion: '20% de descuento en tecnología',
      codigo: 'TECH20',
      categoria: 'Tecnología',
      tienda: 'Amazon',
      descuento: '20%',
      vigencia: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 1234,
      likes: 456,
      color: 'from-blue-500 to-blue-600',
      icono: '💻'
    },
    {
      _id: 2,
      titulo: 'Uber Eats - $5.000 OFF',
      descripcion: '$5.000 en tu primera orden',
      codigo: 'NUEVOUBER',
      categoria: 'Comida',
      tienda: 'Uber Eats',
      descuento: '$5.000',
      vigencia: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 892,
      likes: 234,
      color: 'from-green-500 to-green-600',
      icono: '🍔'
    },
    {
      _id: 3,
      titulo: 'Nike - 30% OFF',
      descripcion: '30% en zapatillas seleccionadas',
      codigo: 'NIKE30',
      categoria: 'Ropa',
      tienda: 'Nike',
      descuento: '30%',
      vigencia: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 2341,
      likes: 789,
      color: 'from-orange-500 to-orange-600',
      icono: '👟'
    },
    {
      _id: 4,
      titulo: 'Spotify - 3 Meses Gratis',
      descripcion: 'Prueba Premium por 3 meses',
      codigo: 'SPOTIFY3M',
      categoria: 'Entretenimiento',
      tienda: 'Spotify',
      descuento: '100%',
      vigencia: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 3456,
      likes: 1234,
      color: 'from-green-500 to-emerald-600',
      icono: '🎵'
    },
    {
      _id: 5,
      titulo: 'Falabella - 25% OFF',
      descripcion: '25% en electrodomésticos',
      codigo: 'HOGAR25',
      categoria: 'Hogar',
      tienda: 'Falabella',
      descuento: '25%',
      vigencia: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 567,
      likes: 123,
      color: 'from-purple-500 to-purple-600',
      icono: '🏠'
    },
    {
      _id: 6,
      titulo: 'Gympass - 50% OFF',
      descripción: 'Primer mes con 50% descuento',
      codigo: 'GYM50',
      categoria: 'Deportes',
      tienda: 'Gympass',
      descuento: '50%',
      vigencia: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      verificado: false,
      usos: 234,
      likes: 89,
      color: 'from-red-500 to-red-600',
      icono: '💪'
    },
    {
      _id: 7,
      titulo: 'Rappi - Envío Gratis',
      descripcion: 'Envío gratis en compras +$15.000',
      codigo: 'RAPPIFREE',
      categoria: 'Comida',
      tienda: 'Rappi',
      descuento: 'Gratis',
      vigencia: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 1890,
      likes: 456,
      color: 'from-pink-500 to-pink-600',
      icono: '🛵'
    },
    {
      _id: 8,
      titulo: 'Udemy - 80% OFF',
      descripcion: '80% en cursos seleccionados',
      codigo: 'LEARN80',
      categoria: 'Educación',
      tienda: 'Udemy',
      descuento: '80%',
      vigencia: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      verificado: true,
      usos: 4567,
      likes: 1890,
      color: 'from-indigo-500 to-indigo-600',
      icono: '📚'
    },
  ];

  const categorias = [
    { nombre: 'Todas', valor: 'todas', icono: '🌟' },
    { nombre: 'Tecnología', valor: 'Tecnología', icono: '💻' },
    { nombre: 'Comida', valor: 'Comida', icono: '🍔' },
    { nombre: 'Ropa', valor: 'Ropa', icono: '👕' },
    { nombre: 'Entretenimiento', valor: 'Entretenimiento', icono: '🎬' },
    { nombre: 'Hogar', valor: 'Hogar', icono: '🏠' },
    { nombre: 'Deportes', valor: 'Deportes', icono: '💪' },
    { nombre: 'Educación', valor: 'Educación', icono: '📚' },
  ];

  // 🔹 cuando selecciona categoría, registramos evento
  const handleSeleccionCategoria = (valor) => {
    setFiltroCategoria(valor);
    if (valor !== 'todas') {
      registrarEvento('visita_cupones_categoria', { categoria: valor });
    }
  };

  const cuponesFiltrados = cupones
    .filter(cupon => {
      if (filtroCategoria !== 'todas' && cupon.categoria !== filtroCategoria) return false;
      if (busqueda) {
        const b = busqueda.toLowerCase();
        return (
          cupon.titulo?.toLowerCase().includes(b) ||
          cupon.descripcion?.toLowerCase().includes(b) ||
          cupon.tienda?.toLowerCase().includes(b) ||
          cupon.codigo?.toLowerCase().includes(b)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (ordenar) {
        case 'populares':
          return (b.usos || 0) - (a.usos || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'descuento':
          const da = parseInt(a.descuento) || 0;
          const db = parseInt(b.descuento) || 0;
          return db - da;
        case 'expiran':
          return new Date(a.vigencia) - new Date(b.vigencia);
        default:
          return new Date(b.vigencia) - new Date(a.vigencia);
      }
    });

  const totalCupones = cupones.length;
  const cuponesVerificados = cupones.filter(c => c.verificado).length;
  const totalUsos = cupones.reduce((sum, c) => sum + (c.usos || 0), 0);
  const ahorroEstimado = cupones.reduce((sum, c) => {
    const match = c.descuento?.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) * 1000 : 5000);
  }, 0);

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    alert(`✅ Código ${codigo} copiado al portapapeles`);
  };

  const darLike = (id) => {
    setCupones(cupones.map(c =>
      c._id === id ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
  };

  const diasRestantes = (fecha) => {
    const dias = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando cupones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl">🎟️</span>
            Cupones de Descuento
          </h1>
          <p className="text-gray-400 text-xl">
            Ahorra dinero con los mejores cupones verificados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition text-center">
            <div className="text-4xl mb-2">🎟️</div>
            <div className="text-sm opacity-90 mb-1">Cupones</div>
            <div className="text-3xl font-bold">{totalCupones}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition text-center">
            <div className="text-4xl mb-2">✓</div>
            <div className="text-sm opacity-90 mb-1">Verificados</div>
            <div className="text-3xl font-bold">{cuponesVerificados}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-sm opacity-90 mb-1">Usos</div>
            <div className="text-3xl font-bold">{totalUsos.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-sm opacity-90 mb-1">Ahorro</div>
            <div className="text-2xl font-bold">${(ahorroEstimado / 1000).toFixed(0)}K</div>
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Filtrar por Categoría</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categorias.map((cat) => (
              <button
                key={cat.valor}
                onClick={() => handleSeleccionCategoria(cat.valor)}
                className={`p-4 rounded-xl font-bold transition hover:scale-105 transform ${
                  filtroCategoria === cat.valor
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-3xl mb-1">{cat.icono}</div>
                <div className="text-xs">{cat.nombre}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Búsqueda y Ordenamiento */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Buscar cupón, tienda o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white.focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="recientes">Más Recientes</option>
              <option value="populares">Más Populares</option>
              <option value="likes">Más Likes</option>
              <option value="descuento">Mayor Descuento</option>
              <option value="expiran">Expiran Pronto</option>
            </select>
          </div>
        </div>

        {/* Grid de Cupones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuponesFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-8xl mb-4">🎟️</div>
              <h2 className="text-3xl font-bold text-white mb-4">No hay cupones</h2>
              <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
            </div>
          ) : (
            cuponesFiltrados.map((cupon) => {
              const dias = diasRestantes(cupon.vigencia);
              return (
                <div
                  key={cupon._id}
                  className={`relative bg-gradient-to-br ${cupon.color} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer overflow-hidden`}
                  onClick={() => setCuponSeleccionado(cupon)}
                >
                  {cupon.verificado && (
                    <div className="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      ✓ Verificado
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-6xl mb-3">{cupon.icono}</div>
                    <h3 className="text-2xl font-bold mb-2">{cupon.titulo}</h3>
                    <p className="text-sm opacity-90">{cupon.descripcion}</p>
                  </div>

                  <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-80 mb-1">Código:</p>
                        <p className="text-2xl font-bold tracking-wider">{cupon.codigo}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copiarCodigo(cupon.codigo);
                        }}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-bold"
                      >
                        📋 Copiar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="opacity-80">💰 Descuento:</span>
                      <span className="font-bold text-lg">{cupon.descuento}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-80">🏪 Tienda:</span>
                      <span className="font-bold">{cupon.tienda}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-80">⏰ Expira en:</span>
                      <span className={`font-bold ${dias <= 3 ? 'text-yellow-300' : ''}`}>
                        {dias} {dias === 1 ? 'día' : 'días'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          darLike(cupon._id);
                        }}
                        className="flex items-center gap-1 hover:scale-110 transition"
                      >
                        <span className="text-xl">❤️</span>
                        <span className="font-bold">{cupon.likes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <span className="text-xl">👥</span>
                        <span className="font-bold">{cupon.usos || 0}</span>
                      </div>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-bold text-sm">
                      Ver más →
                    </button>
                  </div>

                  {dias <= 3 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-black text-center py-1 text-xs font-bold">
                      ⚠️ ¡EXPIRA PRONTO!
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {cuponSeleccionado && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setCuponSeleccionado(null)}
          >
            <div
              className={`bg-gradient-to-br ${cuponSeleccionado.color} rounded-2xl p-8 max-w-2xl w-full text-white shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ... modal igual al que ya tienes ... */}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/comparador"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg hover:scale-105"
          >
            ⚖️ Comparar Precios
          </Link>
        </div>
      </div>
    </div>
  );
}
