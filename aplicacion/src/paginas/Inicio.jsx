import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Función auxiliar para calcular tiempo (se mantiene igual)
function calcularTiempo(fecha) {
  const ahora = new Date();
  const creado = new Date(fecha);
  const diferencia = Math.floor((ahora - creado) / 1000);

  if (diferencia < 60) return 'unos segundos';

  const minutos = Math.floor(diferencia / 60);
  if (minutos < 60) return `${minutos} ${minutos === 1 ? 'min' : 'mins'}`;

  const horas = Math.floor(diferencia / 3600);
  if (horas < 24) return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;

  const dias = Math.floor(diferencia / 86400);
  return `${dias} ${dias === 1 ? 'día' : 'días'}`;
}

export default function Inicio() {
  const [codigos, setCodigos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const obtenerCodigos = useCallback(async (filtro = 'Todos') => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/api/codigos';
      
      if (filtro !== 'Todos') {
        url = `http://localhost:3000/api/codigos?categoria=${filtro}`; 
      }

      const res = await axios.get(url, {
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined 
        }
      });
      
      setCodigos(Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
    } catch (error) {
      console.error('Error obteniendo códigos:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerCodigos(categoriaActiva);
  }, [categoriaActiva, obtenerCodigos]);

  const handleFiltrar = (categoria) => {
    setCategoriaActiva(categoria);
  };

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo)
      .then(() => {
        alert('¡Código copiado al portapapeles! 🎉');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar el código. Intenta manualmente.');
      });
  };

  if (cargando) {
    return (
      // Color de fondo del loader ajustado al nuevo esquema oscuro
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          {/* Color del spinner ajustado */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando cupones...</p>
        </div>
      </div>
    );
  }

  // --- JSX RENDER ---
  return (
    // Fondo general más oscuro
    <div className="min-h-screen bg-gray-900">
      
      {/* 1. Header MEJORADO con gradiente Púrpura/Fucsia como en tu logo */}
      <div className="bg-gradient-to-r from-purple-800 to-fuchsia-600 shadow-xl"> 
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <span className="text-4xl">🎟️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Cupones de Descuento</h1>
                <p className="text-pink-100 text-lg">
                  Ahorra dinero con nuestros cupones exclusivos • **{codigos.length}** disponibles
                </p>
              </div>
            </div>
            {/* Botón 'Agregar Cupón' ajustado al color de énfasis */}
            <Link
              to="/codigos/agregar"
              className="bg-white text-fuchsia-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2 hover:scale-105 transform"
            >
              <span className="text-2xl">+</span>
              Agregar Cupón
            </Link>
          </div>
        </div>
      </div>

      ---

      {/* 2. Filtros rápidos MEJORADOS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['Todos', 'Tecnología', 'Comida', 'Ropa', 'Hogar'].map((categoria) => (
            <button
              key={categoria}
              onClick={() => handleFiltrar(categoria)}
              // Color de botón activo ajustado
              className={`px-6 py-2 rounded-full transition border border-gray-700 whitespace-nowrap font-medium 
                ${categoriaActiva === categoria 
                  ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-lg' // Estilo activo
                  : 'bg-gray-800 text-white hover:bg-gray-700' // Estilo inactivo
                }`
              }
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      ---

      {/* 3. Grid de cupones MEJORADO */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {codigos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🎟️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
                {categoriaActiva === 'Todos' 
                    ? 'No hay cupones disponibles' 
                    : `No hay cupones en la categoría "${categoriaActiva}"`
                }
            </h2>
            <p className="text-gray-400 text-lg mb-8">¡Sé el primero en agregar un cupón!</p>
            <Link
              to="/codigos/agregar"
              // Botón "Agregar Primer Cupón" ajustado
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-fuchsia-700 transition shadow-lg"
            >
              <span className="text-2xl">+</span>
              Agregar Primer Cupón
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codigos.map((cupon) => (
              <div
                key={cupon._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-fuchsia-500 transition hover:scale-105 transform" // Borde de hover ajustado
              >
                {/* Header de la tarjeta ajustado */}
                <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">😎</span>
                    <span className="bg-white text-fuchsia-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {cupon.tienda || 'Tienda'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">
                    {cupon.nombreProducto || 'Producto'}
                  </h3>
                  <p className="text-pink-100 text-sm">
                    {cupon.autor?.nombre || 'Usuario Anónimo'} • Hace **{calcularTiempo(cupon.createdAt)}**
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-6 text-base leading-relaxed">
                    {cupon.descripcion || 'Descuento especial sin descripción.'}
                  </p>

                  {/* Botón Copiar ajustado */}
                  <div className="bg-gray-900 rounded-xl p-4 mb-4 border-2 border-dashed border-gray-700">
                    <p className="text-gray-400 text-xs mb-2 uppercase font-semibold">Código de descuento</p>
                    <div className="flex items-center justify-between">
                      <code className="text-2xl font-bold text-white tracking-wider select-all">
                        {cupon.codigo}
                      </code>
                      <button
                        onClick={() => copiarCodigo(cupon.codigo)}
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg transition font-bold flex items-center gap-2"
                      >
                        📋 Copiar
                      </button>
                    </div>
                  </div>

                  {/* Footer (sin cambios relevantes) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="text-yellow-400 font-bold">{cupon.likes || 0} likes</span>
                    </div>
                    {cupon.verificado && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        ⭐ Verificado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      ---

      {/* 4. Banner inferior MEJORADO con los nuevos tonos */}
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Tienes un cupón para compartir?
          </h2>
          <p className="text-purple-200 text-lg mb-6">
            Ayuda a la comunidad compartiendo cupones de descuento
          </p>
          <Link
            to="/codigos/agregar"
            // Botón Compartir Cupón ajustado
            className="inline-flex items-center gap-2 bg-white text-fuchsia-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-lg"
          >
            <span className="text-2xl">🎁</span>
            Compartir Cupón
          </Link>
        </div>
      </div>
    </div>
  );
}