// CÓDIGO ACTUALIZADO (Versión Limpia) para: aplicacion/src/paginas/Inicio.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import TarjetaCodigo from '../componentes/TarjetaCodigo';
import FormularioCodigo from '../componentes/FormularioCodigo';
import { obtenerCodigos } from '../servicios/api';

function Inicio() {
    const [codigos, setCodigos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const cargarCodigos = async () => {
        try {
            setLoading(true);
            const res = await obtenerCodigos();
            setCodigos(res.data);
            setError(null);
        } catch (err) {
            // El error 401/403 es manejado por RutaProtegida,
            // aquí solo manejamos errores de servidor/red (500, etc.)
            setError('Error al cargar los códigos. Revisa la conexión al servidor.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCodigos();
    }, []);

    const handleCodigoCreado = (nuevoCodigo) => {
        setCodigos([nuevoCodigo, ...codigos]);
        setMostrarFormulario(false);
    };

    const renderContenido = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Cargando códigos...</p>;
        }

        if (error) {
            return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>;
        }

        if (codigos.length === 0) {
            return <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">No hay códigos para mostrar todavía.</p>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {codigos.map(codigo => (
                    <TarjetaCodigo key={codigo._id} codigo={codigo} /> 
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Últimos Códigos
                    </h1>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors"
                    >
                        + Añadir Código
                    </button>
                </div>

                <div className="px-4 sm:px-0">
                    {renderContenido()}
                </div>
            </main>

            {mostrarFormulario && (
                <FormularioCodigo 
                    onClose={() => setMostrarFormulario(false)}
                    onSuccess={handleCodigoCreado}
                />
            )}
        </div>
    );
}

export default Inicio;