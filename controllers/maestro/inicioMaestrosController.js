const { pool } = require('../../database/connectionPostgreSQL');
const webpush = require('web-push');

const agregarAlumno = async (req, res) => {
    try {
        const { nombre, app, apm } = req.body;
        //consulta para insertar primero al alumno
        const idMaestro = req.session.idUsuario;
        const consulta = 'insert into alumnos (nombre,app,apm,"idMaestro") values($1,$2,$3,$4)';
        const valores = [nombre, app, apm, idMaestro];
        await pool.query(consulta, valores);
        res.redirect('/maestro/inicioMaestros?status=alumnoAgregado');
    } catch (error) {
        console.error('error en el controlador', error)
        res.redirect('/maestro/inicioMaestro?status=error');
    }
}

const tablaAlumno = async (req, res) => {
    try {
        const idMaestro = req.session.idUsuario;
        const consulta = `SELECT
        alumnos."idAlumno" AS "idAlumno",
        alumnos.nombre AS alumnos_nombre,
        alumnos.app AS alumnos_app,
        alumnos.apm AS alumnos_apm,
        alumnos."idPapa" AS "idPapa",
        papa.nombre AS nombre_papa,
        papa.apellidos AS apellidos_papa,
        alumnos.tarea AS alumnos_tarea,
        alumnos.fecha AS alumnos_fecha
        FROM alumnos
        -- Primer JOIN: Para validar la relación con el maestro
        INNER JOIN usuarios AS maestro ON alumnos."idMaestro" = maestro."idUsuario"
        -- Segundo JOIN: Para traer los datos del papá
        LEFT JOIN usuarios AS papa ON alumnos."idPapa" = papa."idUsuario"
        WHERE alumnos."idMaestro" = $1 ORDER BY alumnos_nombre ASC;`;
        const valores = [idMaestro];
        const datos = await pool.query(consulta, valores);
        res.json(datos.rows);
    } catch (error) {
        console.error(error)
    }
}

const agregarUsuario = async (req, res) => {
    try {
        const { nombre, apellidos, rol, usuario } = req.body;

        const consultaVerificarUsuario = 'select * from usuarios where usuario = $1';
        const valoresVerificarUsuario = [usuario];
        const resultadoVerificarUsuario = await pool.query(consultaVerificarUsuario, valoresVerificarUsuario);
        if (resultadoVerificarUsuario.rows.length > 0) {
            return res.redirect('/maestro/inicioMaestros?status=usuarioExistente');
        } else{
        const idAsignado = req.session.idUsuario;
        const consulta = 'insert into usuarios(nombre,apellidos,rol,usuario,"idAsignado",push_subscription) values($1,$2,$3,$4,$5,$6)';
        const valores = [nombre, apellidos, rol, usuario, idAsignado, null];
        await pool.query(consulta, valores);
        res.redirect('/maestro/inicioMaestros?status=usuarioAgregado');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/maestro/inicioMaestros?status=error');
    }
}

const editarAlumno = async (req, res) => {
    try {

        const { idAlumno, nombre, app ,apm , idPapa, tarea, fecha } = req.body;
        const consulta = 'UPDATE alumnos SET nombre=$1,app=$2,apm=$3,"idPapa"=$4,tarea=$5,fecha=$6 where "idAlumno" = $7'
        const valores = [nombre, app,apm, idPapa, tarea, fecha, idAlumno];

        await pool.query(consulta, valores);

        if (idPapa) {
            const resultado = await pool.query(
                'SELECT push_subscription FROM usuarios WHERE "idUsuario" = $1',
                [idPapa]
            );
            const rawSub = resultado.rows[0]?.push_subscription;
            const sub = rawSub
                ? (typeof rawSub === 'string' ? JSON.parse(rawSub) : rawSub)
                : null;

            if (sub && sub.endpoint) {
                const payload = JSON.stringify({
                    title: '¡Nueva Tarea!',
                    message: `Se ha asignado: ${tarea || 'una tarea'}`,
                    url: '/login'
                });
                try {
                    await webpush.sendNotification(sub, payload);
                } catch (pushErr) {
                    // Si la suscripción expiró o ya no existe, la limpiamos para no fallar siempre
                    const statusCode = pushErr?.statusCode;
                    if (statusCode === 404 || statusCode === 410) {
                        await pool.query(
                            'UPDATE usuarios SET push_subscription = $1 WHERE "idUsuario" = $2',
                            [null, idPapa]
                        );
                    }
                    console.error('Error al enviar push:', statusCode || pushErr?.code, pushErr?.body || pushErr?.message);
                }
            }
        }
        res.redirect('/maestro/inicioMaestros?status=alumnoActualizado');
    } catch (error) {
        console.error(error);
        res.redirect('/maestro/inicioMaestros?status=error');
    }
}
const selectPapa = async (req, res) => {
    try {
        const idAsignado = req.session.idUsuario;
        const consulta = `select "idUsuario",nombre,apellidos from usuarios where rol='Papa' AND "idAsignado"=$1 order by nombre asc`;
        const valores = [idAsignado]
        const resultado = await pool.query(consulta,valores);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error)
    }
}

const eliminarAlumno = async(req,res)=>{
    try{
        const id = req.params.id;
    const consulta = 'delete from alumnos where "idAlumno"=$1'
    const valores = [id];
    await pool.query(consulta,valores);
    res.redirect('/maestro/inicioMaestros?status=alumnoEliminado')
    }catch(error){
        res.redirect('/maestro/inicioMaestros?status=alumnoNoEliminado')
        console.error(error);
    }
};

module.exports = { agregarAlumno, tablaAlumno, agregarUsuario, editarAlumno, selectPapa, eliminarAlumno };