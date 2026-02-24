const pg = require('pg');
//configuracion de la conexion a sql
const pool=new pg.Pool({
    host:'localhost',
    port:'5432',
    database:'proyecto_pm',
    user:'postgres',
    password:'Aggtcraft1'
});

module.exports = { pool };