// CÓDIGO para el NUEVO ARCHIVO: aplicacion/src/paginas/Comparador.jsx

import React, { useState } from 'react';
import Navbar from '../componentes/Navbar';
import { buscarPrecios } from '../servicios/api';

// Categorías disponibles para filtrar la búsqueda
const CATEGORIAS = ['tecnologia', 'mujer', 'hombre', 'hogar', 'deporte'];

// Componente para renderizar cada fila de la comparación
const ResultadoCard = ({ resultado }) => {
    // Determina si es el más barato (el primero en la lista después de la ordenación)
    const isBestDeal = resultado.isBestDeal;

    return (
        <div className={`flex items-center bg-white p-4 rounded-lg shadow-md border-l-4 ${isBestDeal ? 'border-green-500' : 'border-gray-200'}`}>
            <div className="w-1/4">
                <p className="text-lg font-bold uppercase">{resultado.tienda}</p>
            </div>

            <div className="w-3/4 grid grid-cols-3 gap-2 text-center">
                
                {/* Precio Bruto */}
                <div>
                    <p className="text-sm text-gray-500 line-through">Precio Normal:</p>
                    <p className="text-md">${resultado.precioBruto.toLocaleString('es-CL')}</p>
                </div>

                {/* Descuento Aplicado */}
                <div className={`${resultado.codigoAplicado ? 'text-blue-600' : 'text-gray-400'}`}>
                    <p className="text-sm font-semibold">Cupón Aplicado:</p>
                    <p className="text-md font-bold">{resultado.descuentoAplicado}</p>
                    <p className="text-xs">{resultado.codigoAplicado || 'N/A'}</p>
                </div>

                {/* Precio Final */}
                <div>
                    <p className="text-sm font-semibold text-green-700">Precio Final:</p>
                    <p className={`text-xl font-extrabold ${isBestDeal ? 'text-green-600' : 'text-gray-800'}`}>
                        ${resultado.precioFinal.toLocaleString('es-CL')}
                    </p>
                </div>

                <div className="col-span-3 mt-2">
                    <a 
                        href={resultado.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700 underline"
                    >
                        Ir a la tienda
                    </a>
                </div>
            </div>
        </div>
    );
};


function Comparador() {
    const [producto, setProducto] = useState('Audífonos');
    const [categoria, setCategoria] = useState('tecnologia');
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResultados(null);

        try {
            const res = await buscarPrecios({ params: { producto, categoria } });
            
            // Marcar el resultado más barato
            const resultadosMarcados = res.data.resultados.map((r, index) => ({
                ...r,
                isBestDeal: index === 0 // El primero en la lista (que ya viene ordenado) es la mejor oferta
            }));

            setResultados(resultadosMarcados);
        } catch (err) {
            setError('Error al buscar precios. Revisa el servidor.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-0">
                    Comparador de Precios y Cupones
                </h1>

                {/* Formulario de Búsqueda */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                        
                        <div className="w-full md:w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Producto a Comparar
                            </label>
                            <input
                                type="text"
                                value={producto}
                                onChange={(e) => setProducto(e.target.value)}
                                placeholder="Ej: Audífonos, Zapatillas Nike, TV 4K"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                            >
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-1/4 bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Buscando...' : 'Comparar Precios'}
                        </button>
                    </form>
                </div>

                {/* Sección de Resultados */}
                <div className="space-y-4">
                    {error && (
                        <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</p>
                    )}
                    
                    {resultados && resultados.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mt-6">
                                Resultados para "{producto}"
                            </h2>
                            {resultados.map((res, index) => (
                                <ResultadoCard key={index} resultado={res} />
                            ))}
                        </>
                    )}

                    {resultados && resultados.length === 0 && (
                        <p className="text-center p-4 bg-yellow-100 rounded-md">No se encontraron resultados ni cupones verificados para esta categoría.</p>
                    )}

                </div>
            </main>
        </div>
    );
}

export default Comparador;