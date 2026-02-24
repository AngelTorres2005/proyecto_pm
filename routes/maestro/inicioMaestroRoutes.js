const express = require('express');
const router = express.Router();
const inicioMaestrosController = require('../../controllers/maestro/inicioMaestrosController')

router.post('/agregarAlumno', inicioMaestrosController.agregarAlumno);
router.get('/tablaAlumno', inicioMaestrosController.tablaAlumno);
router.post('/agregarUsuario', inicioMaestrosController.agregarUsuario);
router.post('/editarAlumno',inicioMaestrosController.editarAlumno);
router.get('/selectPapa',inicioMaestrosController.selectPapa);
router.get('/eliminarAlumno/:id',inicioMaestrosController.eliminarAlumno)
module.exports = router;