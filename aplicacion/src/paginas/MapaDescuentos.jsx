import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Necesario para el parche de íconos
import Navbar from '../componentes/Navbar';
import { obtenerTiendasFisicas } from '../servicios/api';

// ===============================================
// === PARCHE CRÍTICO DE LEAFLET PARA ÍCONOS ===
// Fuerza a Leaflet a usar íconos de una CDN en lugar de buscar rutas locales fallidas.
// ===============================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ===============================================


function MapaDescuentos() {
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false); // Estado para forzar renderizado en cliente

    // Coordenadas de Santiago de Chile
    const centroChile = [-33.447487, -70.673676]; 

    useEffect(() => {
        // 1. Marca que el componente está montado para evitar el error de contexto
        setIsClient(true); 

        const cargarTiendas = async () => {
            try {
                const res = await obtenerTiendasFisicas();
                setTiendas(res.data);
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
        if (loading) return <p className="text-center py-10">Cargando mapa y ubicaciones...</p>;
        if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
        
        // 2. Si no estamos en el cliente O no hay datos, mostramos mensaje
        if (!isClient || tiendas.length === 0) {
            return <p className="text-center py-10">Inicializando mapa o no hay tiendas físicas con códigos para mostrar.</p>;
        }

        return (
            <div style={{ height: '70vh', width: '100%' }}> 
                {/* 3. MapContainer solo se renderiza si isClient es true */}
                <MapContainer 
                    center={centroChile} 
                    zoom={12} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {tiendas.map((tienda) => {
                        const [lng, lat] = tienda.ubicacion.coordinates;
                        
                        return (
                            <Marker position={[lat, lng]} key={tienda._id}>
                                <Popup>
                                    <h3 className="font-bold">{tienda.nombre}</h3>
                                    <p>{tienda.direccion}</p>
                                    <p className="text-sm text-gray-500">Tienda: {tienda.tienda.toUpperCase()}</p>
                                </Popup>
                            </Marker>
                        );
                    })}

                </MapContainer>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-0">
                    Mapa de Descuentos en Tiendas Físicas
                </h1>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {renderMapa()}
                </div>
            </main>
        </div>
    );
}

export default MapaDescuentos;