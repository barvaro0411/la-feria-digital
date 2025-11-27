const express = require('express');
const router = express.Router();
const {
  obtenerTransacciones,
  crearTransaccion,
  obtenerEstadisticas,
  eliminarTransaccion
} = require('../controladores/transaccionesController');
const auth = require('../middlewares/auth'); // ✅ CAMBIADO

// Todas las rutas requieren autenticación
router.use(auth); // ✅ CAMBIADO

router.route('/')
  .get(obtenerTransacciones)
  .post(crearTransaccion);

router.get('/estadisticas', obtenerEstadisticas);

router.delete('/:id', eliminarTransaccion);

module.exports = router;
