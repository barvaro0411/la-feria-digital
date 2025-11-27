// CÓDIGO para el NUEVO ARCHIVO: aplicacion/src/paginas/Alertas.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import { obtenerSuscripciones, toggleSuscripcion } from '../servicios/api';

// Categorías disponibles para suscribirse
const CATEGORIAS = ["mujer", "hombre", "hogar", "tecnologia", "deporte"]; 

function Alertas() {
    const [suscripciones, setSuscripciones] = useState([]); // Array de categorías suscritas
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');

    const cargarSuscripciones = async () => {
        setLoading(true);
        try {
            const res = await obtenerSuscripciones();
            setSuscripciones(res.data); // Esperamos un array de strings: ['tecnologia', 'deporte']
        } catch (error) {
            setMensaje('Error al cargar sus preferencias de alertas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSuscripciones();
    }, []);

    const handleToggle = async (categoria) => {
        setMensaje('');
        try {
            const res = await toggleSuscripcion(categoria);
            
            if (res.data.activa) {
                // Suscrito: Añadir la categoría al estado local
                setSuscripciones([...suscripciones, categoria]);
            } else {
                // Cancelado: Filtrar la categoría del estado local
                setSuscripciones(suscripciones.filter(cat => cat !== categoria));
            }

            setMensaje(res.data.msg);

        } catch (error) {
            setMensaje(error.response?.data?.msg || 'Error al actualizar la alerta.');
        }
    };

    const isSuscrito = (categoria) => suscripciones.includes(categoria);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-0">
                    🔔 Configurar Alertas de Códigos
                </h1>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 mb-6">
                        Selecciona las categorías de las que deseas recibir alertas por correo cuando se publique un nuevo código verificado.
                    </p>

                    {loading ? (
                        <p className="text-center">Cargando...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {CATEGORIAS.map(categoria => (
                                <button
                                    key={categoria}
                                    onClick={() => handleToggle(categoria)}
                                    className={`py-3 px-4 rounded-lg font-semibold transition-colors shadow-sm ${
                                        isSuscrito(categoria) 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)} 
                                    {isSuscrito(categoria) ? ' (Activo)' : ' (Inactivo)'}
                                </button>
                            ))}
                        </div>
                    )}

                    {mensaje && (
                        <p className={`mt-6 text-center p-3 rounded-md ${mensaje.includes('Error') ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                            {mensaje}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Alertas;