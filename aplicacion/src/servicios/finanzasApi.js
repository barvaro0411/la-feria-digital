import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Helper para obtener headers con token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// ========== TRANSACCIONES ==========
export const obtenerTransacciones = async (filtros = {}) => {
  const params = new URLSearchParams(filtros);
  const response = await axios.get(`${API_URL}/transacciones?${params.toString()}`, getAuthHeaders());
  return response;
};

export const crearTransaccion = async (datos) => {
  const response = await axios.post(`${API_URL}/transacciones`, datos, getAuthHeaders());
  return response;
};

export const eliminarTransaccion = async (id) => {
  const response = await axios.delete(`${API_URL}/transacciones/${id}`, getAuthHeaders());
  return response;
};

export const obtenerEstadisticas = async (mes, anio) => {
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes);
  if (anio) params.append('anio', anio);
  
  const response = await axios.get(`${API_URL}/transacciones/estadisticas?${params.toString()}`, getAuthHeaders());
  return response;
};

// ========== METAS DE AHORRO ==========
export const obtenerMetas = async (estado = null) => {
  const params = estado ? `?estado=${estado}` : '';
  const response = await axios.get(`${API_URL}/metas${params}`, getAuthHeaders());
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

export const agregarFondosMeta = async (id, monto) => {
  const response = await axios.post(`${API_URL}/metas/${id}/agregar-fondos`, { monto }, getAuthHeaders());
  return response;
};

export const eliminarMeta = async (id) => {
  const response = await axios.delete(`${API_URL}/metas/${id}`, getAuthHeaders());
  return response;
};

// ========== PRESUPUESTO ==========
export const obtenerPresupuestos = async () => {
  const response = await axios.get(`${API_URL}/presupuestos`, getAuthHeaders());
  return response;
};

export const obtenerPresupuestoActual = async () => {
  const response = await axios.get(`${API_URL}/presupuestos/actual`, getAuthHeaders());
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
