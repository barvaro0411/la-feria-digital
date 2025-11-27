import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [menuFinanzasAbierto, setMenuFinanzasAbierto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-panda-dark border-b border-gray-800 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <Link to="/inicio" className="flex items-center space-x-3 hover:opacity-80 transition">
            <img 
              src="/nubi-logo.jpg" 
              alt="Nubi Logo" 
              className="h-12 w-12 rounded-full object-cover shadow-lg border-2 border-blue-400"
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
              
              {/* Menú desplegable de Finanzas */}
              <div className="relative">
                <button
                  onClick={() => setMenuFinanzasAbierto(!menuFinanzasAbierto)}
                  className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
                >
                  💰 Finanzas
                  <span className={`text-xs transition-transform ${menuFinanzasAbierto ? 'rotate-180' : ''}`}>▼</span>
                </button>
                
                {menuFinanzasAbierto && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuFinanzasAbierto(false)}
                    ></div>
                    
                    <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuFinanzasAbierto(false)}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition border-b border-gray-700 rounded-t-lg"
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        to="/transacciones"
                        onClick={() => setMenuFinanzasAbierto(false)}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition border-b border-gray-700"
                      >
                        📋 Ver Transacciones
                      </Link>
                      <Link
                        to="/transacciones/nueva"
                        onClick={() => setMenuFinanzasAbierto(false)}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition border-b border-gray-700"
                      >
                        ➕ Nueva Transacción
                      </Link>
                      <Link
                        to="/metas"
                        onClick={() => setMenuFinanzasAbierto(false)}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition border-b border-gray-700"
                      >
                        🎯 Mis Metas
                      </Link>
                      <Link
                        to="/presupuesto"
                        onClick={() => setMenuFinanzasAbierto(false)}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition rounded-b-lg"
                      >
                        💼 Presupuesto
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Link 
                to="/chat-nubi" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                ☁️ Chat
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
