import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Borra el token de autenticación
        localStorage.removeItem('token');
        
        // 2. Redirige al usuario a la página de login
        navigate('/login');
    };

    return (
        <nav className="bg-panda-card border-b border-gray-700 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo/Nombre de la aplicación */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/inicio" className="text-2xl font-extrabold text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <span className="text-3xl">🐼</span> 
                            <span>Promo<span className="text-panda-primary">Panda</span></span>
                        </Link>
                    </div>
                    
                    {/* Navegación y Botón de Sesión */}
                    <div className="flex items-center space-x-6">
                        
                        {/* Enlace: Mapa */}
                        <Link 
                            to="/mapa" 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
                        >
                            🗺️ Mapa
                        </Link>
                        
                        {/* Enlace: Comparador */}
                        <Link 
                            to="/comparador" 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
                        >
                            ⚖️ Comparador
                        </Link>

                        {/* Enlace: Alertas */}
                        <Link 
                            to="/alertas" 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
                        >
                            🔔 Alertas
                        </Link>
                        
                        {/* Botón: Cerrar Sesión */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-400 border border-red-500/50 py-1.5 px-4 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all text-sm"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;