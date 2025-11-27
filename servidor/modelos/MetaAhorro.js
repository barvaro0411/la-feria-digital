const mongoose = require('mongoose');

const metaAhorroSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  montoObjetivo: {
    type: Number,
    required: [true, 'El monto objetivo es obligatorio'],
    min: [1, 'El monto debe ser mayor a 0']
  },
  montoActual: {
    type: Number,
    default: 0,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Ahorro', 'Vivienda', 'Vehículo', 'Viaje', 'Educación', 'Tecnología', 'Salud', 'Inversión', 'Emergencia', 'Entretenimiento', 'Otro'], // ✅ CORREGIDO
    default: 'Ahorro'
  },
  fechaLimite: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['activa', 'completada', 'pausada', 'cancelada'],
    default: 'activa'
  },
  prioridad: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  icono: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  historial: [{
    fecha: { type: Date, default: Date.now },
    monto: Number,
    tipo: { type: String, enum: ['deposito', 'retiro'] },
    nota: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para calcular el progreso
metaAhorroSchema.virtual('progreso').get(function() {
  if (!this.montoObjetivo || this.montoObjetivo === 0) return 0;
  return ((this.montoActual / this.montoObjetivo) * 100).toFixed(2);
});

// Método para agregar fondos
metaAhorroSchema.methods.agregarFondos = function(monto, nota = '') {
  this.montoActual += monto;
  this.historial.push({
    monto,
    tipo: 'deposito',
    nota
  });
  
  // Si alcanzó el objetivo, marcar como completada
  if (this.montoActual >= this.montoObjetivo && this.estado === 'activa') {
    this.estado = 'completada';
  }
  
  return this.save();
};

// Método para retirar fondos
metaAhorroSchema.methods.retirarFondos = function(monto, nota = '') {
  if (this.montoActual < monto) {
    throw new Error('Fondos insuficientes en la meta');
  }
  
  this.montoActual -= monto;
  this.historial.push({
    monto,
    tipo: 'retiro',
    nota
  });
  
  return this.save();
};

module.exports = mongoose.model('MetaAhorro', metaAhorroSchema);
