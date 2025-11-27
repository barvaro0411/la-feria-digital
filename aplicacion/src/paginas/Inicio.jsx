import React, { useState, useEffect } from 'react';
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
      return <div className="text-center py-12">Cargando códigos...</div>;
    }

    if (error) {
      return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    if (codigos.length === 0) {
      return <div className="text-center py-12 text-gray-500">No hay códigos para mostrar todavía.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codigos.map((codigo) => (
          <TarjetaCodigo key={codigo._id} codigo={codigo} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🐼 Códigos de Descuento</h1>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Agregar Código'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-8">
          <FormularioCodigo onCodigoCreado={handleCodigoCreado} />
        </div>
      )}

      {renderContenido()}
    </div>
  );
}

export default Inicio;
