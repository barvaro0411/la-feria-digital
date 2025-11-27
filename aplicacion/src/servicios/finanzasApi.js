import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// ========== TRANSACCIONES ==========
export const obtenerTransacciones = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const { data } = await axios.get(`${API_URL}/transacciones?${params}`, config());
  return data;
};

export const crearTransaccion = async (transaccion) => {
  const { data } = await axios.post(`${API_URL}/transacciones`, transaccion, config());
  return data;
};

export const eliminarTransaccion = async (id) => {
  const { data } = await axios.delete(`${API_URL}/transacciones/${id}`, config());
  return data;
};

export const obtenerEstadisticas = async (mes, anio) => {
  const params = mes && anio ? `?mes=${mes}&anio=${anio}` : '';
  const { data } = await axios.get(`${API_URL}/transacciones/estadisticas${params}`, config());
  return data;
};

// ========== METAS ==========
export const obtenerMetas = async (estado = null) => {
  const params = estado ? `?estado=${estado}` : '';
  const { data } = await axios.get(`${API_URL}/metas${params}`, config());
  return data;
};

export const crearMeta = async (meta) => {
  const { data } = await axios.post(`${API_URL}/metas`, meta, config());
  return data;
};

export const agregarFondosMeta = async (id, monto) => {
  const { data } = await axios.put(`${API_URL}/metas/${id}/agregar-fondos`, { monto }, config());
  return data;
};

export const actualizarMeta = async (id, meta) => {
  const { data } = await axios.put(`${API_URL}/metas/${id}`, meta, config());
  return data;
};

export const eliminarMeta = async (id) => {
  const { data } = await axios.delete(`${API_URL}/metas/${id}`, config());
  return data;
};

// ========== PRESUPUESTOS ==========
export const obtenerPresupuestoActual = async () => {
  const { data } = await axios.get(`${API_URL}/presupuestos/actual`, config());
  return data;
};

export const crearPresupuesto = async (presupuesto) => {
  const { data } = await axios.post(`${API_URL}/presupuestos`, presupuesto, config());
  return data;
};

export const sincronizarPresupuesto = async (id) => {
  const { data } = await axios.put(`${API_URL}/presupuestos/${id}/sincronizar`, {}, config());
  return data;
};

export const obtenerHistorialPresupuestos = async () => {
  const { data } = await axios.get(`${API_URL}/presupuestos/historial`, config());
  return data;
};
