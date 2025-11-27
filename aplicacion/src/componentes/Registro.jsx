import React, { useState } from 'react';
import { registrarUsuario } from '../servicios/api';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registrarUsuario(form);
      setMensaje(res.data.msg + ". Ahora serás redirigido para iniciar sesión."); 
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setMensaje(error.response?.data?.msg || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crear Cuenta
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="nombre" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input 
              type="text" 
              name="nombre" 
              id="nombre"
              placeholder="Tu Nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label 
              htmlFor="correo" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input 
              type="email" 
              name="correo" 
              id="correo"
              placeholder="tu@correo.com" 
              value={form.correo} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input 
              type="password" 
              name="password" 
              id="password"
              placeholder="••••••••" 
              value={form.password} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrar
          </button>
        </form>

        {mensaje && (
          <p className={`mt-4 text-center p-2 rounded-md ${mensaje.includes('Error') ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
            {mensaje}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;