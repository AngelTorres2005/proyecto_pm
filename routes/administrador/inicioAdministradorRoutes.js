const express = require('express');
const router = express.Router();
const inicioAdministradorController = require('../../controllers/administrador/inicioAdministradorController')

router.get('/tablaAlumno-administrador', inicioAdministradorController.tablaAlumno);

module.exports = router;