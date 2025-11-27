const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true
  },
  tipo: {
    type: String,
    enum: ['ingreso', 'gasto'],
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: [
      'Alimentación',
      'Transporte',
      'Entretenimiento',
      'Salud',
      'Educación',
      'Vivienda',
      'Ropa',
      'Tecnología',
      'Servicios',
      'Ahorro',
      'Otros'
    ]
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 200
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  // CONEXIÓN CON CUPONES
  cuponUtilizado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Codigo',
    default: null
  },
  montoOriginal: {
    type: Number,
    default: null // Precio antes del descuento
  },
  ahorroGenerado: {
    type: Number,
    default: 0, // Diferencia entre montoOriginal y monto
    min: 0
  },
  notas: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Índices para consultas rápidas
TransaccionSchema.index({ usuario: 1, fecha: -1 });
TransaccionSchema.index({ usuario: 1, tipo: 1 });
TransaccionSchema.index({ usuario: 1, categoria: 1 });

// Método virtual para calcular ahorro automáticamente
TransaccionSchema.pre('save', function(next) {
  if (this.montoOriginal && this.monto) {
    this.ahorroGenerado = this.montoOriginal - this.monto;
  }
  next();
});

module.exports = mongoose.model('Transaccion', TransaccionSchema);
