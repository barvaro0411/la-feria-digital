const express = require('express');
const router = express.Router();
const {
  obtenerPresupuestoActual,
  crearPresupuesto,
  sincronizarPresupuesto,
  obtenerHistorial
} = require('../controladores/presupuestosController');
const auth = require('../middlewares/auth'); // ✅ CAMBIADO

router.use(auth); // ✅ CAMBIADO

router.get('/actual', obtenerPresupuestoActual);
router.get('/historial', obtenerHistorial);
router.post('/', crearPresupuesto);
router.put('/:id/sincronizar', sincronizarPresupuesto);

module.exports = router;
