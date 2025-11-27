import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTransaccion } from '../servicios/finanzasApi';
import { obtenerCodigos } from '../servicios/api';

export default function NuevaTransaccion() {
  const navigate = useNavigate();
  const [cupones, setCupones] = useState([]);
  const [formData, setFormData] = useState({
    tipo: 'gasto',
    monto: '',
    montoOriginal: '',
    categoria: 'Alimentación',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    cuponUtilizado: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usoCupon, setUsoCupon] = useState(false);

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    try {
      const res = await obtenerCodigos();
      setCupones(res.data);
    } catch (err) {
      console.error('Error cargando cupones:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.monto || parseFloat(formData.monto) <= 0) {
        setError('El monto debe ser mayor a 0');
        setLoading(false);
        return;
      }

      if (usoCupon && !formData.montoOriginal) {
        setError('Debes ingresar el monto original antes del descuento');
        setLoading(false);
        return;
      }

      const datos = {
        ...formData,
        monto: parseFloat(formData.monto),
        montoOriginal: usoCupon ? parseFloat(formData.montoOriginal) : null,
        cuponUtilizado: usoCupon && formData.cuponUtilizado ? formData.cuponUtilizado : null
      };

      await crearTransaccion(datos);
      navigate('/transacciones', { state: { mensaje: 'Transacción registrada exitosamente' } });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const ahorroCalculado = usoCupon && formData.montoOriginal && formData.monto
    ? (parseFloat(formData.montoOriginal) - parseFloat(formData.monto)).toFixed(0)
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">💰 Registrar Nueva Transacción</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Tipo de Transacción */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Tipo</label>
          <div className="flex gap-4">
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="gasto"
                checked={formData.tipo === 'gasto'}
                onChange={handleChange}
                className="mr-2"
              />
              💸 Gasto
            </label>
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="ingreso"
                checked={formData.tipo === 'ingreso'}
                onChange={handleChange}
                className="mr-2"
              />
              💵 Ingreso
            </label>
          </div>
        </div>

        {/* ¿Usó cupón? */}
        {formData.tipo === 'gasto' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={usoCupon}
                onChange={(e) => setUsoCupon(e.target.checked)}
                className="mr-3 w-5 h-5"
              />
              <span className="font-semibold text-gray-800">🎟️ Usé un cupón de descuento</span>
            </label>
          </div>
        )}

        {/* Monto Original (si usó cupón) */}
        {usoCupon && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Monto Original (antes del descuento)
            </label>
            <input
              type="number"
              name="montoOriginal"
              value={formData.montoOriginal}
              onChange={handleChange}
              placeholder="Ej: 20000"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={usoCupon}
            />
          </div>
        )}

        {/* Monto Final */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {usoCupon ? 'Monto Final (después del descuento)' : 'Monto'}
          </label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            placeholder="Ej: 15000"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {usoCupon && ahorroCalculado > 0 && (
            <p className="text-green-600 font-semibold mt-2">
              ✅ ¡Ahorraste ${ahorroCalculado}!
            </p>
          )}
        </div>

        {/* Seleccionar Cupón */}
        {usoCupon && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Cupón Utilizado (opcional)
            </label>
            <select
              name="cuponUtilizado"
              value={formData.cuponUtilizado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Sin vincular cupón --</option>
              {cupones.map(cupon => (
                <option key={cupon._id} value={cupon._id}>
                  {cupon.tienda} - {cupon.codigo}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Alimentación">🍔 Alimentación</option>
            <option value="Transporte">🚗 Transporte</option>
            <option value="Entretenimiento">🎮 Entretenimiento</option>
            <option value="Salud">💊 Salud</option>
            <option value="Educación">📚 Educación</option>
            <option value="Vivienda">🏠 Vivienda</option>
            <option value="Ropa">👕 Ropa</option>
            <option value="Tecnología">💻 Tecnología</option>
            <option value="Servicios">🔧 Servicios</option>
            <option value="Ahorro">💰 Ahorro</option>
            <option value="Otros">📦 Otros</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ej: Compra en supermercado"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="200"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Notas (opcional)</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            placeholder="Agrega comentarios adicionales..."
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="500"
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : '💾 Guardar Transacción'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
