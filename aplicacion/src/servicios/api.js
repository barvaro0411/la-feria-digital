import axios from 'axios';

// Detecta automáticamente el entorno (desarrollo o producción)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para obtener headers con token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// ========== AUTENTICACIÓN ==========
export const registrarUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/register`, datos);
  return response;
};

export const loginUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/login`, datos);
  return response;
};

export const obtenerPerfil = async () => {
  const response = await axios.get(`${API_URL}/auth/perfil`, getAuthHeaders());
  return response;
};

// ========== CÓDIGOS/CUPONES ==========
export const obtenerCodigos = async () => {
  const response = await axios.get(`${API_URL}/codigos`, getAuthHeaders());
  return response;
};

export const crearCodigo = async (codigo) => {
  const response = await axios.post(`${API_URL}/codigos`, codigo, getAuthHeaders());
  return response;
};

export const verificarCodigo = async (id) => {
  const response = await axios.post(`${API_URL}/codigos/${id}/verificar`, {}, getAuthHeaders());
  return response;
};

export const votarCodigo = async (id, voto) => {
  const response = await axios.post(`${API_URL}/codigos/${id}/votar`, { voto }, getAuthHeaders());
  return response;
};

// ========== COMPARADOR ==========
export const buscarEnComparador = async (producto, categoria = '') => {
  const params = new URLSearchParams();
  if (producto) params.append('producto', producto);
  if (categoria) params.append('categoria', categoria);
  
  const response = await axios.get(`${API_URL}/comparador?${params.toString()}`, getAuthHeaders());
  return response;
};

// ========== SUSCRIPCIONES/ALERTAS ==========
export const obtenerSuscripciones = async () => {
  const response = await axios.get(`${API_URL}/alertas`, getAuthHeaders());
  return response;
};

export const toggleSuscripcion = async (categoria) => {
  const response = await axios.post(`${API_URL}/alertas/toggle`, { categoria }, getAuthHeaders());
  return response;
};

export const crearAlerta = async (datos) => {
  const response = await axios.post(`${API_URL}/alertas`, datos, getAuthHeaders());
  return response;
};

export const eliminarAlerta = async (id) => {
  const response = await axios.delete(`${API_URL}/alertas/${id}`, getAuthHeaders());
  return response;
};

// ========== TIENDAS FÍSICAS ==========
export const obtenerTiendasFisicas = async () => {
  const response = await axios.get(`${API_URL}/tiendas-fisicas`, getAuthHeaders());
  return response;
};

// ========== EVENTOS ==========
export const obtenerEventos = async () => {
  const response = await axios.get(`${API_URL}/eventos`, getAuthHeaders());
  return response;
};

export const crearEvento = async (datos) => {
  const response = await axios.post(`${API_URL}/eventos`, datos, getAuthHeaders());
  return response;
};

export const actualizarEvento = async (id, datos) => {
  const response = await axios.put(`${API_URL}/eventos/${id}`, datos, getAuthHeaders());
  return response;
};

export const eliminarEvento = async (id) => {
  const response = await axios.delete(`${API_URL}/eventos/${id}`, getAuthHeaders());
  return response;
};

// ========== TRANSACCIONES ==========
export const obtenerTransacciones = async () => {
  const response = await axios.get(`${API_URL}/transacciones`, getAuthHeaders());
  return response;
};

export const crearTransaccion = async (datos) => {
  const response = await axios.post(`${API_URL}/transacciones`, datos, getAuthHeaders());
  return response;
};

export const actualizarTransaccion = async (id, datos) => {
  const response = await axios.put(`${API_URL}/transacciones/${id}`, datos, getAuthHeaders());
  return response;
};

export const eliminarTransaccion = async (id) => {
  const response = await axios.delete(`${API_URL}/transacciones/${id}`, getAuthHeaders());
  return response;
};

export const obtenerEstadisticasTransacciones = async () => {
  const response = await axios.get(`${API_URL}/transacciones/estadisticas`, getAuthHeaders());
  return response;
};

// ========== METAS ==========
export const obtenerMetas = async () => {
  const response = await axios.get(`${API_URL}/metas`, getAuthHeaders());
  return response;
};

export const crearMeta = async (datos) => {
  const response = await axios.post(`${API_URL}/metas`, datos, getAuthHeaders());
  return response;
};

export const actualizarMeta = async (id, datos) => {
  const response = await axios.put(`${API_URL}/metas/${id}`, datos, getAuthHeaders());
  return response;
};

export const eliminarMeta = async (id) => {
  const response = await axios.delete(`${API_URL}/metas/${id}`, getAuthHeaders());
  return response;
};

export const agregarAhorroMeta = async (id, cantidad) => {
  const response = await axios.post(`${API_URL}/metas/${id}/ahorrar`, { cantidad }, getAuthHeaders());
  return response;
};

// ========== PRESUPUESTOS ==========
export const obtenerPresupuestos = async () => {
  const response = await axios.get(`${API_URL}/presupuestos`, getAuthHeaders());
  return response;
};

export const crearPresupuesto = async (datos) => {
  const response = await axios.post(`${API_URL}/presupuestos`, datos, getAuthHeaders());
  return response;
};

export const actualizarPresupuesto = async (id, datos) => {
  const response = await axios.put(`${API_URL}/presupuestos/${id}`, datos, getAuthHeaders());
  return response;
};

export const eliminarPresupuesto = async (id) => {
  const response = await axios.delete(`${API_URL}/presupuestos/${id}`, getAuthHeaders());
  return response;
};

export const obtenerEstadoPresupuesto = async (mes, anio) => {
  const response = await axios.get(`${API_URL}/presupuestos/estado?mes=${mes}&anio=${anio}`, getAuthHeaders());
  return response;
};

// ========== CHAT NUBI (IA) ==========
export const enviarMensajeChat = async (datos) => {
  const response = await axios.post(`${API_URL}/chat/mensaje`, datos, getAuthHeaders());
  return response;
};

export const obtenerHistorialChat = async () => {
  const response = await axios.get(`${API_URL}/chat/historial`, getAuthHeaders());
  return response;
};

export const limpiarHistorialChat = async () => {
  const response = await axios.delete(`${API_URL}/chat/historial`, getAuthHeaders());
  return response;
};

// ========== INTERCEPTORES GLOBALES ==========
// Interceptor para agregar token automáticamente a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default {
  // Auth
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  
  // Códigos
  obtenerCodigos,
  crearCodigo,
  verificarCodigo,
  votarCodigo,
  
  // Comparador
  buscarEnComparador,
  
  // Alertas
  obtenerSuscripciones,
  toggleSuscripcion,
  crearAlerta,
  eliminarAlerta,
  
  // Tiendas
  obtenerTiendasFisicas,
  
  // Eventos
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  
  // Transacciones
  obtenerTransacciones,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerEstadisticasTransacciones,
  
  // Metas
  obtenerMetas,
  crearMeta,
  actualizarMeta,
  eliminarMeta,
  agregarAhorroMeta,
  
  // Presupuestos
  obtenerPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  obtenerEstadoPresupuesto,
  
  // Chat
  enviarMensajeChat,
  obtenerHistorialChat,
  limpiarHistorialChat
};
