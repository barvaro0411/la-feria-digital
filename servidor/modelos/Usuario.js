const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Nuevos campos para PromoPanda Social
  avatar: { type: String, default: '' }, // URL o string base64
  reputacion: { type: Number, default: 0 }, // Puntos de gamificación
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  siguiendo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  
  creado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);