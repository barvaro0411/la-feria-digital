// Modelo de Codigo de descuento
const mongoose = require('mongoose');

const codigoSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    tienda: { type: String, required: true },
    categoria: { type: String, required: true },
    descuento: { type: String, required: true },
    descripcion: String,
    fechaExpiracion: Date,
    verificado: { type: Boolean, default: false },
    
    // Cambios para PromoPanda Social:
    creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // Quién lo subió
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }], // Array de IDs de usuarios que dieron like
    likesCount: { type: Number, default: 0 }, // Contador para acceso rápido
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Codigo', codigoSchema);