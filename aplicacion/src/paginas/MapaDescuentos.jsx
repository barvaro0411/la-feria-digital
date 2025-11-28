import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados por categoría
const createCustomIcon = (emoji) => {
  return L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 3px solid white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Componente para centrar el mapa
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MapaDescuentos() {
  const [tiendas, setTiendas] = useState([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState([-33.4489, -70.6693]); // Santiago por defecto
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [vistaActual, setVistaActual] = useState('mapa');
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  useEffect(() => {
    cargarTiendas();
    obtenerUbicacionUsuario();
  }, []);

  const obtenerUbicacionUsuario = () => {
    setCargandoUbicacion(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario([position.coords.latitude, position.coords.longitude]);
          setCargandoUbicacion(false);
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
          setCargandoUbicacion(false);
        }
      );
    } else {
      setCargandoUbicacion(false);
    }
  };

  const cargarTiendas = () => {
    // Datos de ejemplo - En producción vendrían del backend
    const tiendasEjemplo = [
      {
        id: 1,
        nombre: 'Supermercado Central',
        categoria: 'Alimentación',
        icono: '🍔',
        direccion: 'Av. Libertador Bernardo O\'Higgins 1234',
        telefono: '+56 2 2345 6789',
        descuento: '15% en compras sobre $50.000',
        horario: 'Lun-Sab: 9:00-21:00, Dom: 10:00-20:00',
        lat: -33.4450,
        lng: -70.6600,
        color: 'from-orange-500 to-orange-600',
        valoracion: 4.5,
        distancia: 0.8
      },
      {
        id: 2,
        nombre: 'TechStore Pro',
        categoria: 'Tecnología',
        icono: '💻',
        direccion: 'Av. Providencia 2500',
        telefono: '+56 2 2987 6543',
        descuento: '20% en laptops y tablets',
        horario: 'Lun-Vie: 10:00-20:00, Sáb: 10:00-18:00',
        lat: -33.4300,
        lng: -70.6100,
        color: 'from-blue-500 to-blue-600',
        valoracion: 4.8,
        distancia: 2.3
      },
      {
        id: 3,
        nombre: 'Gym Fitness Plus',
        categoria: 'Deportes',
        icono: '💪',
        direccion: 'Av. Las Condes 9876',
        telefono: '+56 2 2456 7890',
        descuento: '30% primer mes de membresía',
        horario: 'Lun-Dom: 6:00-23:00',
        lat: -33.4100,
        lng: -70.5800,
        color: 'from-green-500 to-green-600',
        valoracion: 4.3,
        distancia: 5.1
      },
      {
        id: 4,
        nombre: 'Fashion Store',
        categoria: 'Ropa',
        icono: '👕',
        direccion: 'Mall Plaza 2° Piso',
        telefono: '+56 2 2345 1234',
        descuento: '25% en toda la tienda',
        horario: 'Lun-Dom: 10:00-21:00',
        lat: -33.4600,
        lng: -70.6500,
        color: 'from-pink-500 to-pink-600',
        valoracion: 4.6,
        distancia: 1.2
      },
      {
        id: 5,
        nombre: 'RestaurantePlus',
        categoria: 'Restaurantes',
        icono: '🍽️',
        direccion: 'Barrio Lastarria 567',
        telefono: '+56 2 2678 9012',
        descuento: '2x1 en platos principales',
        horario: 'Lun-Dom: 12:00-23:00',
        lat: -33.4380,
        lng: -70.6380,
        color: 'from-red-500 to-red-600',
        valoracion: 4.7,
        distancia: 0.5
      },
      {
        id: 6,
        nombre: 'Cine Premium',
        categoria: 'Entretenimiento',
        icono: '🎬',
        direccion: 'Centro Comercial 3° Piso',
        telefono: '+56 2 2789 0123',
        descuento: '50% Martes y Miércoles',
        horario: 'Lun-Dom: 11:00-00:00',
        lat: -33.4520,
        lng: -70.6720,
        color: 'from-purple-500 to-purple-600',
        valoracion: 4.4,
        distancia: 1.8
      },
      {
        id: 7,
        nombre: 'Farmacia Salud+',
        categoria: 'Salud',
        icono: '💊',
        direccion: 'Av. Apoquindo 4321',
        telefono: '+56 2 2890 1234',
        descuento: '10% con tarjeta de descuento',
        horario: 'Lun-Dom: 8:00-22:00',
        lat: -33.4200,
        lng: -70.5900,
        color: 'from-teal-500 to-teal-600',
        valoracion: 4.5,
        distancia: 3.7
      },
      {
        id: 8,
        nombre: 'Librería Cultural',
        categoria: 'Educación',
        icono: '📚',
        direccion: 'Paseo Ahumada 123',
        telefono: '+56 2 2901 2345',
        descuento: '20% en libros de texto',
        horario: 'Lun-Vie: 9:00-20:00, Sáb: 10:00-19:00',
        lat: -33.4400,
        lng: -70.6500,
        color: 'from-indigo-500 to-indigo-600',
        valoracion: 4.2,
        distancia: 0.9
      },
    ];

    setTiendas(tiendasEjemplo);
  };

  const categorias = [
    { nombre: 'Todas', valor: 'todas', icono: '🌟' },
    { nombre: 'Alimentación', valor: 'Alimentación', icono: '🍔' },
    { nombre: 'Tecnología', valor: 'Tecnología', icono: '💻' },
    { nombre: 'Deportes', valor: 'Deportes', icono: '💪' },
    { nombre: 'Ropa', valor: 'Ropa', icono: '👕' },
    { nombre: 'Restaurantes', valor: 'Restaurantes', icono: '🍽️' },
    { nombre: 'Entretenimiento', valor: 'Entretenimiento', icono: '🎬' },
    { nombre: 'Salud', valor: 'Salud', icono: '💊' },
    { nombre: 'Educación', valor: 'Educación', icono: '📚' },
  ];

  // Filtrar tiendas
  const tiendasFiltradas = tiendas.filter(tienda => {
    if (filtroCategoria !== 'todas' && tienda.categoria !== filtroCategoria) return false;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      return (
        tienda.nombre.toLowerCase().includes(busquedaLower) ||
        tienda.categoria.toLowerCase().includes(busquedaLower) ||
        tienda.direccion.toLowerCase().includes(busquedaLower) ||
        tienda.descuento.toLowerCase().includes(busquedaLower)
      );
    }
    return true;
  });

  // Calcular estadísticas
  const totalTiendas = tiendasFiltradas.length;
  const tiendasCercanas = tiendasFiltradas.filter(t => t.distancia <= 2).length;
  const descuentoPromedio = tiendasFiltradas.length > 0
    ? Math.round(tiendasFiltradas.reduce((sum, t) => {
        const match = t.descuento.match(/(\d+)%/);
        return sum + (match ? parseInt(match[1]) : 0);
      }, 0) / tiendasFiltradas.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-5xl">🗺️</span>
              Mapa de Descuentos
            </h1>
            <p className="text-gray-400 mt-2">
              Encuentra tiendas con descuentos cerca de ti
            </p>
          </div>
          <button
            onClick={obtenerUbicacionUsuario}
            disabled={cargandoUbicacion}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:scale-105 transform flex items-center gap-2 disabled:opacity-50"
          >
            {cargandoUbicacion ? '🔄' : '📍'} {cargandoUbicacion ? 'Obteniendo...' : 'Mi Ubicación'}
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">🏪</div>
            <div className="text-sm opacity-90 mb-1">Tiendas Disponibles</div>
            <div className="text-3xl font-bold">{totalTiendas}</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">📍</div>
            <div className="text-sm opacity-90 mb-1">Cerca de Ti</div>
            <div className="text-3xl font-bold">{tiendasCercanas}</div>
            <div className="text-xs opacity-80">Menos de 2 km</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-sm opacity-90 mb-1">Descuento Promedio</div>
            <div className="text-3xl font-bold">{descuentoPromedio}%</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-sm opacity-90 mb-1">Valoración Media</div>
            <div className="text-3xl font-bold">4.5</div>
            <div className="text-xs opacity-80">De 5.0 estrellas</div>
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Filtrar por Categoría</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categorias.map((cat) => (
              <button
                key={cat.valor}
                onClick={() => setFiltroCategoria(cat.valor)}
                className={`p-4 rounded-xl font-bold transition hover:scale-105 transform ${
                  filtroCategoria === cat.valor
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-3xl mb-1">{cat.icono}</div>
                <div className="text-xs">{cat.nombre}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Búsqueda y Vista */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="🔍 Buscar tienda, dirección o descuento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="md:col-span-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setVistaActual('mapa')}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                  vistaActual === 'mapa'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🗺️ Mapa
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
        </div>

        {/* Vista Mapa */}
        {vistaActual === 'mapa' && (
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{ height: '600px' }}>
              <MapContainer
                center={ubicacionUsuario}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '16px' }}
              >
                <MapController center={ubicacionUsuario} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {/* Marcador de usuario */}
                <Marker position={ubicacionUsuario} icon={createCustomIcon('📍')}>
                  <Popup>
                    <div className="text-center">
                      <strong>Tu ubicación</strong>
                    </div>
                  </Popup>
                </Marker>

                {/* Marcadores de tiendas */}
                {tiendasFiltradas.map((tienda) => (
                  <Marker
                    key={tienda.id}
                    position={[tienda.lat, tienda.lng]}
                    icon={createCustomIcon(tienda.icono)}
                    eventHandlers={{
                      click: () => setTiendaSeleccionada(tienda)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{tienda.icono} {tienda.nombre}</h3>
                        <p className="text-sm mb-1">📍 {tienda.direccion}</p>
                        <p className="text-sm mb-1">🏷️ {tienda.categoria}</p>
                        <p className="text-sm font-bold text-green-600 mb-2">💰 {tienda.descuento}</p>
                        <button
                          onClick={() => setTiendaSeleccionada(tienda)}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                        >
                          Ver más detalles
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Vista Lista */}
        {vistaActual === 'lista' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiendasFiltradas.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-8xl mb-4">🗺️</div>
                <h2 className="text-3xl font-bold text-white mb-4">No hay tiendas</h2>
                <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
              </div>
            ) : (
              tiendasFiltradas.map((tienda) => (
                <div
                  key={tienda.id}
                  onClick={() => setTiendaSeleccionada(tienda)}
                  className={`bg-gradient-to-r ${tienda.color} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{tienda.icono}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{tienda.nombre}</h3>
                        <p className="text-sm opacity-90">{tienda.categoria}</p>
                      </div>
                    </div>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-bold">
                      📍 {tienda.distancia} km
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm flex items-center gap-2">
                      <span>💰</span>
                      <span className="font-bold">{tienda.descuento}</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span>📍</span>
                      <span>{tienda.direccion}</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span>⏰</span>
                      <span>{tienda.horario}</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span>⭐</span>
                      <span>{tienda.valoracion} / 5.0</span>
                    </p>
                  </div>

                  <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-lg transition">
                    Ver en mapa →
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal de Tienda Seleccionada */}
        {tiendaSeleccionada && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setTiendaSeleccionada(null)}
          >
            <div 
              className={`bg-gradient-to-br ${tiendaSeleccionada.color} rounded-2xl p-8 max-w-2xl w-full text-white shadow-2xl max-h-[90vh] overflow-y-auto`}
              style={{ zIndex: 10000 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{tiendaSeleccionada.icono}</span>
                  <div>
                    <h2 className="text-3xl font-bold">{tiendaSeleccionada.nombre}</h2>
                    <p className="text-lg opacity-90">{tiendaSeleccionada.categoria}</p>
                  </div>
                </div>
                <button
                  onClick={() => setTiendaSeleccionada(null)}
                  className="text-4xl hover:scale-110 transition hover:rotate-90 duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">💰 Oferta Especial</h3>
                <p className="text-2xl font-bold">{tiendaSeleccionada.descuento}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Dirección</p>
                    <p className="opacity-90">{tiendaSeleccionada.direccion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">Teléfono</p>
                    <p className="opacity-90">{tiendaSeleccionada.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-semibold">Horario</p>
                    <p className="opacity-90">{tiendaSeleccionada.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold">Valoración</p>
                    <p className="opacity-90">{tiendaSeleccionada.valoracion} / 5.0 estrellas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <p className="font-semibold">Distancia</p>
                    <p className="opacity-90">{tiendaSeleccionada.distancia} km desde tu ubicación</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setVistaActual('mapa');
                    setTiendaSeleccionada(null);
                  }}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-xl transition"
                >
                  🗺️ Ver en Mapa
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${tiendaSeleccionada.lat},${tiendaSeleccionada.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-blue-600 font-bold py-4 rounded-xl transition hover:scale-105 text-center"
                >
                  🧭 Cómo Llegar
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
