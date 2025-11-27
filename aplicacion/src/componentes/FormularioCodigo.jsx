import React, { useState } from 'react';
import { crearCodigo } from '../servicios/api';

// Categorías disponibles
const CATEGORIAS = [
    'mujer',
    'hombre',
    'hogar',
    'tecnologia',
    'deporte'
];

function FormularioCodigo({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    codigo: '',
    tienda: '',
    descuento: '',
    categoria: 'tecnologia', 
    descripcion: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const res = await crearCodigo(formData);
      // El backend ahora se encarga de asignar al creador automáticamente mediante el token
      
      setMensaje('¡Descuento publicado con éxito! 🚀');
      setFormData({ codigo: '', tienda: '', descuento: '', categoria: 'tecnologia', descripcion: '' });
      
      // Notificar al componente padre para actualizar el feed
      onSuccess(res.data.codigo); 
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      setMensaje(error.response?.data?.msg || 'Error al crear el código. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      
      <div className="bg-nubi-card border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
        
        {/* Botón cerrar */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
            ✕
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Publicar Nuevo <span className="text-nubi-orange">Descuento</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Comparte y gana reputación en la comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tienda" className="block text-xs font-bold text-nubi-blue uppercase mb-1 ml-1">Tienda</label>
              <input 
                type="text" name="tienda" id="tienda" 
                placeholder="Ej: Amazon, Nike..."
                value={formData.tienda} 
                onChange={handleChange} required
                className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-nubi-orange focus:ring-1 focus:ring-nubi-orange transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="codigo" className="block text-xs font-bold text-nubi-blue uppercase mb-1 ml-1">Código</label>
              <input 
                type="text" name="codigo" id="codigo" 
                placeholder="Ej: VERANO2024"
                value={formData.codigo} 
                onChange={handleChange} required
                className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-nubi-orange focus:ring-1 focus:ring-nubi-orange transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="descuento" className="block text-xs font-bold text-nubi-blue uppercase mb-1 ml-1">Beneficio</label>
            <input 
              type="text" name="descuento" id="descuento" 
              placeholder="Ej: 20% OFF en toda la tienda"
              value={formData.descuento} 
              onChange={handleChange} required
              className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-nubi-orange focus:ring-1 focus:ring-nubi-orange transition-all"
            />
          </div>

          <div>
            <label htmlFor="categoria" className="block text-xs font-bold text-nubi-blue uppercase mb-1 ml-1">Categoría</label>
            <select
              name="categoria" id="categoria" value={formData.categoria}
              onChange={handleChange} required
              className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-nubi-orange focus:ring-1 focus:ring-nubi-orange transition-all appearance-none"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800 text-white">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-xs font-bold text-nubi-blue uppercase mb-1 ml-1">Detalles (Opcional)</label>
            <textarea 
              name="descripcion" id="descripcion" 
              placeholder="Agrega condiciones o detalles extra..."
              value={formData.descripcion}
              onChange={handleChange} rows="2"
              className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-nubi-orange focus:ring-1 focus:ring-nubi-orange transition-all resize-none"
            ></textarea>
          </div>

          {mensaje && (
            <div className={`text-center p-3 rounded-lg font-medium text-sm animate-pulse ${mensaje.includes('Error') ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
              {mensaje}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              disabled={cargando}
              className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando}
              className="px-6 py-2.5 bg-gradient-to-r from-nubi-orange to-orange-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-900/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Publicando...' : 'Publicar Código'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormularioCodigo;