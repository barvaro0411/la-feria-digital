import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../servicios/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await loginUsuario(formData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        navigate('/inicio');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 shadow-lg">
            <span className="text-4xl">☁️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-white">Nubi</span>
            <span className="text-blue-400">AI</span>
          </h1>
          <p className="text-gray-300">Bienvenido de vuelta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-blue-400 hover:text-blue-300 font-semibold">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
