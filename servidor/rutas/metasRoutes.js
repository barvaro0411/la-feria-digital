const express = require('express');
const router = express.Router();
const {
  obtenerMetas,
  crearMeta,
  agregarFondos,
  actualizarMeta,
  eliminarMeta
} = require('../controladores/metasController');
const auth = require('../middlewares/auth'); // ✅ CAMBIADO

router.use(auth); // ✅ CAMBIADO

router.route('/')
  .get(obtenerMetas)
  .post(crearMeta);

router.put('/:id/agregar-fondos', agregarFondos);

router.route('/:id')
  .put(actualizarMeta)
  .delete(eliminarMeta);

module.exports = router;
