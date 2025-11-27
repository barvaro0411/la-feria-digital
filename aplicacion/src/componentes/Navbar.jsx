import { Link, useNavigate } from 'react-router-dom';
import nubiLogo from '../assets/nubi-logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-panda-dark border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <Link to="/inicio" className="flex items-center space-x-3 hover:opacity-80 transition">
            <img 
              src={nubiLogo} 
              alt="Nubi Logo" 
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold">
              <span className="text-white">Nubi</span>
              <span className="text-blue-400">AI</span>
            </span>
          </Link>

          {/* Navegación */}
          {token && (
            <div className="flex items-center space-x-6">
              <Link 
                to="/inicio" 
                className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
              >
                🎟️ Cupones
              </Link>
              
              <Link 
                to="/mapa" 
                className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
              >
                🗺️ Mapa
              </Link>
              
              <Link 
                to="/comparador" 
                className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
              >
                ⚖️ Comparador
              </Link>
              
              <Link 
                to="/alertas" 
                className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
              >
                🔔 Alertas
              </Link>
              
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
              >
                💰 Finanzas
              </Link>

              <Link 
                to="/chat-nubi" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                ☁️ Chat con Nubi
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition font-medium"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
