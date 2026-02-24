const { pool } = require('./connectionPostgreSQL');
const bcrypt = require('bcrypt');
//probar la base de datos
const getLanguages = async () => {
    try {
        console.log('Conexion exitosa a la base de datos!')
    } catch (error) {
        console.error(error);
    }
}


getLanguages();