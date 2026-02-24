const { pool } = require('../database/connectionPostgreSQL');
const bcrypt = require('bcrypt')

const verificarLogin = async (req, res) => {
    try {
        const { usuario } = req.body;
        const query = 'select "idUsuario", usuario, rol from usuarios where usuario = $1';
        const valores = [usuario];
        const consulta = await pool.query(query, valores);

        if (consulta.rows.length > 0) {
            const datosUsuario = consulta.rows[0];
            const rol = datosUsuario.rol;
            const idUsuario = datosUsuario.idUsuario;
            const usuarioBD = datosUsuario.usuario;
            if (usuario === usuarioBD) {
                req.session.idUsuario = idUsuario;
                req.session.rol = rol;
                req.session.nombreUsuario = datosUsuario.usuario;

                if (rol === 'Administrador') {
                    return res.redirect('/administrador/inicioAdministrador');
                } else if (rol === 'Maestro') {
                    return res.redirect('/maestro/inicioMaestros'); 
                } else if (rol === 'Papa') {
                    return res.redirect('/usuario/inicioUsuarios');
                }
            } else {
                return res.redirect('/login?error=pass_incorrecta');
            }
        } else {
            return res.redirect('/login?error=usuario_no_existe');
        }
    } catch (error) {
        console.error('Error en el controlador', error);
        res.status(500).send('Error interno del servidor');
    }
}

module.exports = { verificarLogin }