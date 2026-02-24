const { pool } = require('../../database/connectionPostgreSQL');

const tablaAlumno = async (req, res) => {
    try {
        const idPapa = req.session.idUsuario;
        console.log(idPapa);
        const consulta = `select nombre,app,apm,tarea,fecha from alumnos where "idPapa"=$1`;
        const valores = [idPapa];
        const datos = await pool.query(consulta, valores);
        res.json(datos.rows);
    } catch (error) {
        console.error(error)
    }
}

const guardarSuscripcion = async (req, res) => {
    try {
        const idUsuario = req.session?.idUsuario;
        if (!idUsuario) {
            return res.status(401).json({ error: 'Debes iniciar sesión para activar notificaciones' });
        }

        const subscription = req.body;
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Suscripción inválida' });
        }

        await pool.query(
            'UPDATE usuarios SET push_subscription = $1 WHERE "idUsuario" = $2',
            [JSON.stringify(subscription), idUsuario]
        );

        res.status(201).json({ mensaje: 'Suscripción guardada con éxito' });
    } catch (error) {
        console.error('Error en guardarSuscripcion:', error.message);
        if (error.code === '42703') {
            return res.status(500).json({
                error: 'Falta la columna push_subscription en la tabla usuarios. Ejecuta en PostgreSQL: ALTER TABLE usuarios ADD COLUMN push_subscription TEXT;'
            });
        }
        res.status(500).json({ error: 'Error al guardar suscripción', detalle: error.message });
    }
};

module.exports = {tablaAlumno,guardarSuscripcion}