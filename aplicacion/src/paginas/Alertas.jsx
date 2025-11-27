import React, { useState, useEffect } from 'react';
import { obtenerSuscripciones, toggleSuscripcion } from '../servicios/api';

// Categorías disponibles para suscribirse
const CATEGORIAS = ["mujer", "hombre", "hogar", "tecnologia", "deporte"];

function Alertas() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const cargarSuscripciones = async () => {
    setLoading(true);
    try {
      const res = await obtenerSuscripciones();
      setSuscripciones(res.data);
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
        setSuscripciones([...suscripciones, categoria]);
      } else {
        setSuscripciones(suscripciones.filter(cat => cat !== categoria));
      }
      setMensaje(res.data.msg);
    } catch (error) {
      setMensaje(error.response?.data?.msg || 'Error al actualizar la alerta.');
    }
  };

  const isSuscrito = (categoria) => suscripciones.includes(categoria);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">🔔 Configurar Alertas de Códigos</h1>
      <p className="text-gray-600 mb-8">
        Selecciona las categorías de las que deseas recibir alertas por correo cuando se publique un nuevo código verificado.
      </p>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <>
          {mensaje && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded-md">
              {mensaje}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => handleToggle(cat)}
                className={`p-6 rounded-lg border-2 transition-all font-semibold text-center ${
                  isSuscrito(cat)
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} {isSuscrito(cat) ? '(Activo)' : '(Inactivo)'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Alertas;
