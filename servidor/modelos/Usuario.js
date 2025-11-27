const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // ========== NUEVOS CAMPOS FINANCIEROS ==========
  ahorroTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  puntosExperiencia: {
    type: Number,
    default: 0,
    min: 0
  },
  nivel: {
    type: Number,
    default: 1,
    min: 1
  },
  metasActivas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MetaAhorro'
  }],
  presupuestoActual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
  },
  preferenciasFinancieras: {
    categoriasInteres: [String],
    objetivoAhorroMensual: {
      type: Number,
      default: 0
    },
    recordatoriosActivos: {
      type: Boolean,
      default: true
    }
  },
  estadisticas: {
    cuponesUsados: {
      type: Number,
      default: 0
    },
    totalAhorrado: {
      type: Number,
      default: 0
    },
    transaccionesRegistradas: {
      type: Number,
      default: 0
    }
  },
  // ========== CAMPOS ORIGINALES ==========
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Codigo'
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
UsuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para calcular nivel basado en puntos
UsuarioSchema.methods.actualizarNivel = function() {
  this.nivel = Math.floor(this.puntosExperiencia / 100) + 1;
  return this.save();
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
