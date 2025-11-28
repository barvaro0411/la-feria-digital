import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// ========== AUTENTICACIÓN ==========

// Registro de usuario
export const registrarUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/register`, datos);
  return response;
};

// Login de usuario
export const loginUsuario = async (datos) => {
  const response = await axios.post(`${API_URL}/auth/login`, datos);
  return response;
};

// Obtener perfil
export const obtenerPerfil = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/auth/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// ========== CÓDIGOS DE DESCUENTO ==========

// Obtener códigos
export const obtenerCodigos = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/codigos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Crear código
export const crearCodigo = async (datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/codigos`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// ========== TRANSACCIONES ==========

// Obtener transacciones
export const obtenerTransacciones = async (params = {}) => {
  const token = localStorage.getItem('token');
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_URL}/transacciones?${queryString}` : `${API_URL}/transacciones`;
  
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Crear transacción
export const crearTransaccion = async (datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/transacciones`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Eliminar transacción
export const eliminarTransaccion = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/transacciones/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Obtener estadísticas
export const obtenerEstadisticas = async (mes, anio) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/transacciones/estadisticas?mes=${mes}&anio=${anio}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// ========== METAS DE AHORRO ==========

// Obtener metas
export const obtenerMetas = async (estado) => {
  const token = localStorage.getItem('token');
  const url = estado ? `${API_URL}/metas?estado=${estado}` : `${API_URL}/metas`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Crear meta
export const crearMeta = async (datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/metas`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Actualizar meta
export const actualizarMeta = async (id, datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/metas/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Eliminar meta
export const eliminarMeta = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/metas/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Contribuir a meta
export const contribuirMeta = async (id, monto) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/metas/${id}/contribuir`,
    { monto },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response;
};

// ========== PRESUPUESTOS ==========

// Obtener presupuesto actual
export const obtenerPresupuestoActual = async () => {
  const token = localStorage.getItem('token');
  const fecha = new Date();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  
  const response = await axios.get(`${API_URL}/presupuestos/actual?mes=${mes}&anio=${anio}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Crear presupuesto
export const crearPresupuesto = async (datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/presupuestos`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// Actualizar presupuesto
export const actualizarPresupuesto = async (id, datos) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/presupuestos/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

// ========== CHAT NUBI ==========

// Enviar mensaje a Nubi
export const enviarMensajeNubi = async (mensaje) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/chat/nubi`,
    { mensaje },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response;
};
export const registrarEvento = async (tipo, datos = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/eventos`,
    { tipo, datos },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
 };