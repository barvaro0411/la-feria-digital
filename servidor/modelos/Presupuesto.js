const mongoose = require('mongoose');

const CategoriaPresupuestoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  limite: {
    type: Number,
    required: true,
    min: 0
  },
  gastado: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const PresupuestoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true
  },
  mes: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  anio: {
    type: Number,
    required: true
  },
  categorias: [CategoriaPresupuestoSchema],
  totalPresupuesto: {
    type: Number,
    default: 0
  },
  totalGastado: {
    type: Number,
    default: 0
  },
  notas: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Índice compuesto único: un presupuesto por mes/año/usuario
PresupuestoSchema.index({ usuario: 1, mes: 1, anio: 1 }, { unique: true });

// Calcular totales antes de guardar
PresupuestoSchema.pre('save', function(next) {
  this.totalPresupuesto = this.categorias.reduce((sum, cat) => sum + cat.limite, 0);
  this.totalGastado = this.categorias.reduce((sum, cat) => sum + cat.gastado, 0);
  next();
});

// Campo virtual para porcentaje de uso
PresupuestoSchema.virtual('porcentajeUsado').get(function() {
  if (this.totalPresupuesto === 0) return 0;
  return ((this.totalGastado / this.totalPresupuesto) * 100).toFixed(2);
});

PresupuestoSchema.set('toJSON', { virtuals: true });
PresupuestoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Presupuesto', PresupuestoSchema);
