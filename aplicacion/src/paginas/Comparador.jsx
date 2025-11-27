import React, { useState } from 'react';
import { buscarEnComparador } from '../servicios/api';

function Comparador() {
  const [producto, setProducto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!producto.trim()) {
      setError('Por favor, ingresa un producto para buscar.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultados(null);

    try {
      const res = await buscarEnComparador(producto, categoria);
      setResultados(res.data);
    } catch (err) {
      setError('Error al buscar productos. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-6">⚖️ Comparador de Precios y Cupones</h1>

      {/* Formulario de Búsqueda */}
      <form onSubmit={handleBuscar} className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Ej: Notebook HP"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="moda">Moda</option>
            <option value="deporte">Deporte</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* Resultados */}
      {resultados && resultados.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Resultados para "{producto}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((res, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="font-bold text-lg mb-2">{res.tienda}</h3>
                <p className="text-2xl font-extrabold text-green-600 mb-2">${res.precio?.toLocaleString()}</p>
                
                {res.cupon && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-md text-sm mb-3">
                    <strong>Cupón:</strong> {res.cupon}
                  </div>
                )}

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver producto →
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {resultados && resultados.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No se encontraron resultados ni cupones verificados para esta categoría.
        </p>
      )}
    </div>
  );
}

export default Comparador;
