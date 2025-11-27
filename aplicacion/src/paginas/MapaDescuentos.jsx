import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { obtenerTiendasFisicas } from '../servicios/api';

// Parche crítico de Leaflet para íconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapaDescuentos() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const centroChile = [-33.447487, -70.673676];

  useEffect(() => {
    setIsClient(true);

    const cargarTiendas = async () => {
      try {
        const res = await obtenerTiendasFisicas();
        // ✅ FILTRAR solo tiendas con coordenadas válidas
        const tiendasValidas = res.data.filter(
          t => t.latitud != null && t.longitud != null
        );
        setTiendas(tiendasValidas);
      } catch (err) {
        setError('Error al cargar las ubicaciones de tiendas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarTiendas();
  }, []);

  const renderMapa = () => {
    if (loading) return <div className="text-center py-8">Cargando mapa y ubicaciones...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    if (!isClient) {
      return <div className="text-center py-8">Inicializando mapa...</div>;
    }

    if (tiendas.length === 0) {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-md">
          ⚠️ No hay tiendas físicas con ubicación GPS registradas. 
          <br />
          <small>Ejecuta el script de Python para insertar datos de tiendas con coordenadas.</small>
        </div>
      );
    }

    return (
      <MapContainer center={centroChile} zoom={12} style={{ height: '500px', width: '100%' }} className="rounded-lg shadow-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tiendas.map((tienda) => (
          <Marker key={tienda._id} position={[tienda.latitud, tienda.longitud]}>
            <Popup>
              <strong>{tienda.direccion}</strong>
              <br />
              <span>Tienda: {tienda.tienda?.toUpperCase()}</span>
              <br />
              <span className="text-sm text-gray-600">{tienda.codigo || 'Sin código disponible'}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🗺️ Mapa de Descuentos en Tiendas Físicas</h1>
      <p className="text-gray-600 mb-8">
        Encuentra ofertas exclusivas disponibles en tiendas físicas cercanas.
      </p>
      {renderMapa()}
    </div>
  );
}

export default MapaDescuentos;
