// CÓDIGO para el NUEVO ARCHIVO: servidor/modelos/Alerta.js

const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
    // Referencia al usuario (la ID viene del JWT)
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true,
        index: true 
    },
    // La categoría a la que el usuario se ha suscrito
    categoria: { 
        type: String, 
        required: true, 
        enum: ["mujer", "hombre", "hogar", "tecnologia", "deporte"] // Categorías permitidas
    },
    createdAt: { type: Date, default: Date.now }
});

// El índice asegura que un usuario solo pueda suscribirse una vez por categoría
alertaSchema.index({ usuario: 1, categoria: 1 }, { unique: true });

module.exports = mongoose.model('Alerta', alertaSchema);