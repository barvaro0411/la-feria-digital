import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerPresupuestoActual, crearPresupuesto, actualizarPresupuesto } from '../servicios/finanzasApi';

export default function Presupuesto() {
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    categorias: []
  });

  const categoriasDisponibles = [
    { nombre: 'Alimentación', icono: '🍔' },
    { nombre: 'Transporte', icono: '🚗' },
    { nombre: 'Entretenimiento', icono: '🎮' },
    { nombre: 'Salud', icono: '💊' },
    { nombre: 'Educación', icono: '📚' },
    { nombre: 'Vivienda', icono: '🏠' },
    { nombre: 'Ropa', icono: '👕' },
    { nombre: 'Tecnología', icono: '💻' },
    { nombre: 'Servicios', icono: '🔧' },
    { nombre: 'Otros', icono: '📦' }
  ];

  useEffect(() => {
    cargarPresupuesto();
  }, []);

  const cargarPresupuesto = async () => {
    try {
      setLoading(true);
      const res = await obtenerPresupuestoActual();
      
      if (res.data && res.data._id) {
        setPresupuesto(res.data);
        setFormData({
          mes: res.data.mes,
          anio: res.data.anio,
          categorias: res.data.categorias || []
        });
      } else {
        // No hay presupuesto, inicializar formulario
        inicializarCategorias();
      }
    } catch (err) {
      console.error('Error cargando presupuesto:', err);
      inicializarCategorias();
    } finally {
      setLoading(false);
    }
  };

  const inicializarCategorias = () => {
    const categoriasIniciales = categoriasDisponibles.map(cat => ({
      nombre: cat.nombre,
      limite: 0,
      gastado: 0
    }));
    
    setFormData(prev => ({
      ...prev,
      categorias: categoriasIniciales
    }));
  };

  const handleLimiteChange = (index, valor) => {
    const nuevasCategorias = [...formData.categorias];
    nuevasCategorias[index].limite = parseFloat(valor) || 0;
    setFormData({ ...formData, categorias: nuevasCategorias });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      // Filtrar categorías con límite > 0
      const categoriasValidas = formData.categorias.filter(cat => cat.limite > 0);

      if (categoriasValidas.length === 0) {
        setMensaje('❌ Debes establecer al menos un límite de categoría');
        return;
      }

      const datos = {
        ...formData,
        categorias: categoriasValidas
      };

      if (presupuesto && presupuesto._id) {
        await actualizarPresupuesto(presupuesto._id, datos);
        setMensaje('✅ Presupuesto actualizado exitosamente');
      } else {
        await crearPresupuesto(datos);
        setMensaje('✅ Presupuesto creado exitosamente');
      }

      setEditando(false);
      cargarPresupuesto();
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setMensaje('❌ Error al guardar el presupuesto');
      console.error(err);
    }
  };

  const totalPresupuesto = formData.categorias.reduce((sum, cat) => sum + (cat.limite || 0), 0);
  const totalGastado = presupuesto?.categorias.reduce((sum, cat) => sum + (cat.gastado || 0), 0) || 0;
  const porcentajeUsado = totalPresupuesto > 0 ? ((totalGastado / totalPresupuesto) * 100).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📊 Presupuesto Mensual</h1>
        {presupuesto && !editando && (
          <button
            onClick={() => setEditando(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            ✏️ Editar Presupuesto
          </button>
        )}
      </div>

      {mensaje && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          {mensaje}
        </div>
      )}

      {/* Resumen General */}
      {presupuesto && !editando && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm opacity-90 mb-1">Presupuesto Total</div>
            <div className="text-2xl font-bold">${presupuesto.totalPresupuesto?.toLocaleString() || 0}</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">💸</div>
            <div className="text-sm opacity-90 mb-1">Total Gastado</div>
            <div className="text-2xl font-bold">${presupuesto.totalGastado?.toLocaleString() || 0}</div>
          </div>
          <div className={`bg-gradient-to-r ${
            parseFloat(presupuesto.porcentajeUsado) > 90 ? 'from-red-500 to-red-600' :
            parseFloat(presupuesto.porcentajeUsado) > 75 ? 'from-yellow-500 to-yellow-600' :
            'from-green-500 to-green-600'
          } text-white rounded-lg shadow-md p-6`}>
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm opacity-90 mb-1">% Usado</div>
            <div className="text-2xl font-bold">{presupuesto.porcentajeUsado || 0}%</div>
          </div>
        </div>
      )}

      {/* Barra de Progreso General */}
      {presupuesto && !editando && (
        <div className="bg-panda-card rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Progreso General</h2>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2 text-gray-300">
              <span>Gastado: ${presupuesto.totalGastado?.toLocaleString()}</span>
              <span>Total: ${presupuesto.totalPresupuesto?.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  parseFloat(presupuesto.porcentajeUsado) > 90 ? 'bg-red-500' :
                  parseFloat(presupuesto.porcentajeUsado) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(presupuesto.porcentajeUsado, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Categorías */}
      {presupuesto && !editando ? (
        <div className="bg-panda-card rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-white">Categorías</h2>
          <div className="space-y-6">
            {presupuesto.categorias?.map((cat, idx) => {
              const porcentaje = cat.limite > 0 ? ((cat.gastado / cat.limite) * 100).toFixed(0) : 0;
              const icono = categoriasDisponibles.find(c => c.nombre === cat.nombre)?.icono || '📦';
              
              return (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icono}</span>
                      <span className="font-bold text-lg text-white">{cat.nombre}</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      parseFloat(porcentaje) > 90 ? 'text-red-400' :
                      parseFloat(porcentaje) > 75 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {porcentaje}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-2 text-gray-300">
                    <span>Gastado: ${cat.gastado?.toLocaleString() || 0}</span>
                    <span>Límite: ${cat.limite?.toLocaleString() || 0}</span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        parseFloat(porcentaje) > 90 ? 'bg-red-500' :
                        parseFloat(porcentaje) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    ></div>
                  </div>

                  {parseFloat(porcentaje) > 80 && (
                    <p className="text-xs text-yellow-400 mt-2">
                      ⚠️ Te estás acercando al límite de esta categoría
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Formulario de Edición/Creación
        <form onSubmit={handleGuardar} className="bg-panda-card rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-white">
            {presupuesto ? 'Editar Presupuesto' : 'Crear Presupuesto'}
          </h2>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              Establece el límite de gasto mensual para cada categoría:
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <p className="text-blue-300 text-sm">
                💡 Presupuesto Total Estimado: <span className="font-bold">${totalPresupuesto.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {formData.categorias.map((cat, idx) => {
              const icono = categoriasDisponibles.find(c => c.nombre === cat.nombre)?.icono || '📦';
              
              return (
                <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                    <span className="text-xl">{icono}</span>
                    {cat.nombre}
                  </label>
                  <input
                    type="number"
                    value={cat.limite || ''}
                    onChange={(e) => handleLimiteChange(idx, e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-600 rounded-md px-4 py-2 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
            >
              💾 Guardar Presupuesto
            </button>
            {presupuesto && (
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  setFormData({
                    mes: presupuesto.mes,
                    anio: presupuesto.anio,
                    categorias: presupuesto.categorias
                  });
                }}
                className="px-6 bg-gray-700 text-gray-300 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Botón para ir a transacciones */}
      <div className="mt-8 text-center">
        <Link
          to="/transacciones/nueva"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          💰 Registrar Nueva Transacción
        </Link>
      </div>
    </div>
  );
}
