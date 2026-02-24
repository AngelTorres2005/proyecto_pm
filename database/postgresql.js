const { pool } = require('./connectionPostgreSQL');
const bcrypt = require('bcrypt');
//probar la base de datos
const getLanguages = async () => {
    try {
        const resultado = await pool.query('select usuario from usuarios where "idUsuario" = 3');
        console.log('Conexion exitosa a la base de datos!')
    } catch (error) {
        console.error(error);
    }
}


getLanguages();