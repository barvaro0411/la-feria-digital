import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Helper para obtener headers con token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// ========== CÓDIGOS ==========
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

// ========== AUTENTICACIÓN ==========
export const registrarUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/registro`, datos);
  return response;
};

export const loginUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/login`, datos);
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

// ========== TIENDAS FÍSICAS ==========
export const obtenerTiendasFisicas = async () => {
  const response = await axios.get(`${API_URL}/tiendas-fisicas`, getAuthHeaders());
  return response;
};
