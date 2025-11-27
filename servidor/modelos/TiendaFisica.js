// CÓDIGO para el NUEVO ARCHIVO: servidor/modelos/TiendaFisica.js

const mongoose = require('mongoose');

const tiendaFisicaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    tienda: { type: String, required: true, index: true }, // Referencia a la tienda (ej: paris, falabella)
    direccion: { type: String, required: true },
    
    // Campo GeoJSON para coordenadas
    ubicacion: {
        type: {
            type: String, // Debe ser 'Point'
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitud, latitud]
            required: true
        }
    },
    // Crea un índice 2dsphere para permitir consultas geoespaciales
    createdAt: { type: Date, default: Date.now }
});

// Crea el índice Geoespacial en la ubicación
tiendaFisicaSchema.index({ ubicacion: '2dsphere' });

module.exports = mongoose.model('TiendaFisica', tiendaFisicaSchema);