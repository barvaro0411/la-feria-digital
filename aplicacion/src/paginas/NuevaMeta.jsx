import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearMeta } from '../servicios/finanzasApi';

export default function NuevaMeta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    montoObjetivo: '',
    fechaLimite: '',
    categoria: 'Ahorro',
    icono: '🎯',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const iconos = [
    '🎯', '💰', '🏠', '🚗', '✈️', '🎓', '💻', '📱', 
    '🎮', '🏖️', '💍', '👶', '🐕', '🎸', '📚', '🎨'
  ];

  const categorias = [
    'Ahorro', 'Vivienda', 'Vehículo', 'Viaje', 'Educación',
    'Tecnología', 'Salud', 'Inversión', 'Emergencia', 'Entretenimiento', 'Otro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.montoObjetivo || parseFloat(formData.montoObjetivo) <= 0) {
        setError('El monto objetivo debe ser mayor a 0');
        setLoading(false);
        return;
      }

      const datos = {
        ...formData,
        montoObjetivo: parseFloat(formData.montoObjetivo)
      };

      await crearMeta(datos);
      navigate('/metas', { state: { mensaje: 'Meta creada exitosamente' } });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear la meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">🎯 Nueva Meta de Ahorro</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-panda-card rounded-lg shadow-md p-6 space-y-6 border border-gray-700">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Nombre de la Meta</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Viaje a Europa"
            className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="100"
          />
        </div>

        {/* Icono */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Icono</label>
          <div className="grid grid-cols-8 gap-2">
            {iconos.map((icono) => (
              <button
                key={icono}
                type="button"
                onClick={() => setFormData({ ...formData, icono })}
                className={`text-3xl p-2 rounded-md transition ${
                  formData.icono === icono 
                    ? 'bg-blue-600 ring-2 ring-blue-400' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {icono}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Monto Objetivo */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Monto Objetivo</label>
          <input
            type="number"
            name="montoObjetivo"
            value={formData.montoObjetivo}
            onChange={handleChange}
            placeholder="Ej: 500000"
            className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>

        {/* Fecha Límite */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Fecha Límite (opcional)</label>
          <input
            type="date"
            name="fechaLimite"
            value={formData.fechaLimite}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe tu meta de ahorro..."
            rows="3"
            className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="500"
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : '🎯 Crear Meta'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/metas')}
            className="px-6 bg-gray-700 text-gray-300 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
