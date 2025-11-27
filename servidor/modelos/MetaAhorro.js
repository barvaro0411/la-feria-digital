const mongoose = require('mongoose');

const MetaAhorroSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    maxlength: 300
  },
  montoObjetivo: {
    type: Number,
    required: true,
    min: 1
  },
  montoActual: {
    type: Number,
    default: 0,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['Viaje', 'Tecnología', 'Educación', 'Hogar', 'Emergencia', 'Inversión', 'Otro'],
    default: 'Otro'
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaLimite: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'completada', 'cancelada'],
    default: 'activa'
  },
  icono: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true
});

// Campo virtual para calcular progreso
MetaAhorroSchema.virtual('progreso').get(function() {
  return Math.min((this.montoActual / this.montoObjetivo) * 100, 100).toFixed(2);
});

// Campo virtual para saber si está vencida
MetaAhorroSchema.virtual('estaVencida').get(function() {
  return new Date() > this.fechaLimite && this.estado === 'activa';
});

// Configurar para incluir virtuals en JSON
MetaAhorroSchema.set('toJSON', { virtuals: true });
MetaAhorroSchema.set('toObject', { virtuals: true });

// Método para agregar fondos
MetaAhorroSchema.methods.agregarFondos = function(monto) {
  this.montoActual += monto;
  
  // Marcar como completada si alcanza el objetivo
  if (this.montoActual >= this.montoObjetivo) {
    this.estado = 'completada';
  }
  
  return this.save();
};

module.exports = mongoose.model('MetaAhorro', MetaAhorroSchema);
