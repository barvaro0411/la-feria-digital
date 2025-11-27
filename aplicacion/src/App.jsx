// CÓDIGO ACTUALIZADO para: aplicacion/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Registro from './componentes/Registro';
import Login from './componentes/Login';
import Inicio from './paginas/Inicio';
import MapaDescuentos from './paginas/MapaDescuentos';
import Comparador from './paginas/Comparador';
import Alertas from './paginas/Alertas'; // <--- NUEVO
import RutaProtegida from './componentes/RutaProtegida';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        
        <Route 
          path="/inicio" 
          element={
            <RutaProtegida>
              <Inicio />
            </RutaProtegida>
          } 
        />
        
        <Route 
          path="/mapa" 
          element={
            <RutaProtegida>
              <MapaDescuentos />
            </RutaProtegida>
          } 
        />
        
        <Route 
          path="/comparador" 
          element={
            <RutaProtegida>
              <Comparador />
            </RutaProtegida>
          } 
        />

        <Route // <--- RUTA DE ALERTAS
          path="/alertas" 
          element={
            <RutaProtegida>
              <Alertas />
            </RutaProtegida>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;