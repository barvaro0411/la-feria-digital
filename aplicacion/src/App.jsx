import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import RutaProtegida from './componentes/RutaProtegida';

// Páginas
import Inicio from './paginas/Inicio';
import Dashboard from './paginas/Dashboard';
import MapaDescuentos from './paginas/MapaDescuentos';
import Comparador from './paginas/Comparador';
import Alertas from './paginas/Alertas';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas protegidas */}
        <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/mapa" element={<RutaProtegida><MapaDescuentos /></RutaProtegida>} />
        <Route path="/comparador" element={<RutaProtegida><Comparador /></RutaProtegida>} />
        <Route path="/alertas" element={<RutaProtegida><Alertas /></RutaProtegida>} />
        
        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
