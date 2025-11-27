const axios = require('axios');

async function registrar() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      nombre: 'Usuario Prueba',
      email: 'test@ejemplo.com',
      password: 'test123'
    });
    
    console.log('✅ Usuario registrado:', res.data);
    console.log('Token:', res.data.token);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

registrar();
