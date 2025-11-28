import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [menuFinanzasAbierto, setMenuFinanzasAbierto] = useState(false);
  
  // Estado para Modo Oscuro
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-nubi-dark border-b border-gray-200 dark:border-gray-800 shadow-sm relative z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <Link to="/inicio" className="flex items-center space-x-3 hover:opacity-80 transition">
            <img 
              src="/nubi-logo.jpg" 
              alt="Nubi Logo" 
              className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700"
            />
            <span className="text-2xl font-bold">
              <span className="text-nubi-primary">Nubi</span>
              <span className="text-gray-600 dark:text-white">AI</span>
            </span>
          </Link>

          {/* Navegación */}
          {token && (
            <div className="flex items-center space-x-4">
              
              {/* Links Principales */}
              <Link to="/inicio" className="text-gray-600 dark:text-gray-300 hover:text-nubi-primary font-medium hidden md:block">
                Cupones
              </Link>
              <Link to="/mapa" className="text-gray-600 dark:text-gray-300 hover:text-nubi-primary font-medium hidden md:block">
                Mapa
              </Link>
              {/* ✅ RESTAURADO: Comparador */}
              <Link to="/comparador" className="text-gray-600 dark:text-gray-300 hover:text-nubi-primary font-medium hidden md:block">
                Comparador
              </Link>
              {/* ✅ RESTAURADO: Alertas */}
              <Link to="/alertas" className="text-gray-600 dark:text-gray-300 hover:text-nubi-primary font-medium hidden md:block">
                Alertas
              </Link>
              
              {/* Menú Finanzas */}
              <div className="relative">
                <button
                  onClick={() => setMenuFinanzasAbierto(!menuFinanzasAbierto)}
                  className="text-gray-600 dark:text-gray-300 hover:text-nubi-primary font-medium flex items-center gap-1"
                >
                  Finanzas <span className="text-xs">▼</span>
                </button>
                
                {menuFinanzasAbierto && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuFinanzasAbierto(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-nubi-card border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                      <Link to="/dashboard" onClick={() => setMenuFinanzasAbierto(false)} className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">📊 Dashboard</Link>
                      <Link to="/transacciones" onClick={() => setMenuFinanzasAbierto(false)} className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">📋 Transacciones</Link>
                      <Link to="/metas" onClick={() => setMenuFinanzasAbierto(false)} className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">🎯 Metas</Link>
                      <Link to="/presupuesto" onClick={() => setMenuFinanzasAbierto(false)} className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">💼 Presupuesto</Link>
                    </div>
                  </>
                )}
              </div>

              {/* Botón Chat */}
              <Link to="/chat-nubi" className="bg-gradient-to-r from-nubi-primary to-nubi-secondary text-white px-4 py-2 rounded-full font-semibold hover:shadow-md transition text-sm">
                Chat IA
              </Link>

              {/* Toggle Modo Oscuro */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              {/* Salir */}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-sm">
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}