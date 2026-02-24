const express = require('express');
const router = express.Router();
const inicioUsuariosController = require('../../controllers/usuario/inicioUsuariosController');

router.get('/llenarTabla',inicioUsuariosController.tablaAlumno);
router.post('/guardar-suscripcion', inicioUsuariosController.guardarSuscripcion);

module.exports = router;