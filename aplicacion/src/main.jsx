import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './estilos/index.css';
import 'leaflet/dist/leaflet.css'; // <-- Importación CRÍTICA del CSS del mapa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);