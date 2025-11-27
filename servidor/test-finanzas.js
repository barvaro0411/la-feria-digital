const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let TOKEN = '';

async function test() {
  try {
    console.log('🔐 1. Login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@ejemplo.com', // ⚠️ CAMBIAR POR TU EMAIL
      password: 'test123' // ⚠️ CAMBIAR POR TU PASSWORD
    });
    
    TOKEN = login.data.token;
    console.log('✅ Token obtenido:', TOKEN.substring(0, 20) + '...\n');
    
    const config = {
      headers: { Authorization: `Bearer ${TOKEN}` }
    };
    
    console.log('💰 2. Creando transacción...');
    const trans = await axios.post(`${BASE_URL}/transacciones`, {
      tipo: 'gasto',
      monto: 15000,
      montoOriginal: 20000,
      categoria: 'Alimentación',
      descripcion: 'Supermercado con descuento'
    }, config);
    console.log('✅ Ahorro generado: $' + trans.data.data.ahorroGenerado);
    console.log('');
    
    console.log('🎯 3. Creando meta de ahorro...');
    const meta = await axios.post(`${BASE_URL}/metas`, {
      nombre: 'Notebook nuevo',
      montoObjetivo: 800000,
      fechaLimite: '2026-06-30',
      categoria: 'Tecnología',
      icono: '💻'
    }, config);
    console.log('✅ Meta creada:', meta.data.data.nombre);
    console.log('');
    
    console.log('💵 4. Creando presupuesto...');
    const pres = await axios.post(`${BASE_URL}/presupuestos`, {
      mes: 11,
      anio: 2025,
      categorias: [
        { nombre: 'Alimentación', limite: 200000, gastado: 0 },
        { nombre: 'Transporte', limite: 80000, gastado: 0 }
      ]
    }, config);
    console.log('✅ Presupuesto total:', pres.data.data.totalPresupuesto);
    console.log('');
    
    console.log('📊 5. Obteniendo estadísticas...');
    const stats = await axios.get(`${BASE_URL}/transacciones/estadisticas`, config);
    console.log('✅ Ahorro total:', stats.data.data.ahorroTotal);
    console.log('');
    
    console.log('🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
    
  } catch (error) {
    console.error('❌ Error detallado:');
    console.error('URL:', error.config?.url);
    console.error('Método:', error.config?.method);
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data || error.message);
    console.error('');
    console.error('Stack:', error.stack);
  }
}

test();
