const { pool } = require('../../database/connectionPostgreSQL');

const tablaAlumno = async (req, res) => {
    try {
        const consulta = `SELECT
    alumnos."idAlumno" AS "idAlumno",
    alumnos.nombre AS alumnos_nombre,
    alumnos.app AS alumnos_app,
    alumnos.apm AS alumnos_apm,
    alumnos."idPapa" AS "idPapa",
    papa.nombre AS nombre_papa,
    papa.apellidos AS apellidos_papa,
    maestro.nombre AS nombre_maestro_asignado,
    maestro.apellidos AS apellidos_maestro_asignado,
    alumnos.tarea AS alumnos_tarea,
    alumnos.fecha AS alumnos_fecha
FROM alumnos
INNER JOIN usuarios AS maestro ON alumnos."idMaestro" = maestro."idUsuario"
LEFT JOIN usuarios AS papa ON alumnos."idPapa" = papa."idUsuario"
ORDER BY alumnos_nombre ASC;`;
        const datos = await pool.query(consulta);
        res.json(datos.rows);
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    tablaAlumno
}