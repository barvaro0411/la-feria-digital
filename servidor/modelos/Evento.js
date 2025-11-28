// servidor/modelos/Evento.js
const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo: {
    type: String,
    required: true, // ej: 'visita_cupones', 'visita_metas'
    index: true
  },
  datos: {
    type: Object,
    default: {}
  },
  creadoEn: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Evento', EventoSchema);
