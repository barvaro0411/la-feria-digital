// CÓDIGO FINAL para: aplicacion/src/servicios/api.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para añadir el token JWT a las peticiones protegidas
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registrarUsuario = (datos) => {
  return apiClient.post('/auth/registro', datos);
};

export const loginUsuario = (datos) => {
  return apiClient.post('/auth/login', datos);
};

// Permite pasar un objeto de configuración que puede incluir `params` para filtros
export const obtenerCodigos = (config = {}) => {
  return apiClient.get('/codigos', config);
};

export const crearCodigo = (datos) => {
  return apiClient.post('/codigos', datos); 
};

export const votarCodigo = (id, voto) => {
    return apiClient.put(`/codigos/${id}/votar`, { voto });
};

export const verificarCodigo = (id) => {
    return apiClient.put(`/codigos/${id}/verificar`);
};
// NUEVA FUNCIÓN: Obtener ubicaciones de tiendas físicas
export const obtenerTiendasFisicas = () => {
    return apiClient.get('/tiendas-fisicas'); // Llama a GET /api/tiendas-fisicas
};
// NUEVA FUNCIÓN: Búsqueda de precios para el comparador
export const buscarPrecios = (config = {}) => {
    // Usa 'config' para pasar los parámetros del producto
    return apiClient.get('/comparador/buscar', config);
};
export const obtenerSuscripciones = () => {
    return apiClient.get('/alertas');
};

export const toggleSuscripcion = (categoria) => {
    return apiClient.post('/alertas/toggle', { categoria });
};