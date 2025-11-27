// CÓDIGO para el NUEVO ARCHIVO: aplicacion/src/componentes/RutaProtegida.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
    // 1. Revisa si existe el token JWT en el almacenamiento local
    const token = localStorage.getItem('token');

    if (!token) {
        // 2. Si NO hay token, redirige al usuario a la página de login
        // 'replace' evita que el usuario pueda volver a la ruta protegida con el botón 'Atrás'
        return <Navigate to="/login" replace />;
    }

    // 3. Si SÍ hay token, renderiza la página solicitada (children o Outlet)
    // Usamos 'children' si lo envolvemos en App.jsx, pero Outlet es más limpio en React Router v6
    return children ? children : <Outlet />;
};

export default RutaProtegida;