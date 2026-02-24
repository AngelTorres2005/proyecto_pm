require('dotenv').config();

//CREACION DEL SERVIDOR, RUTAS.
const express = require('express');
const path = require('path');
const morgan = require('morgan');

const webpush = require('web-push');


webpush.setVapidDetails(
    'mailto:tu-correo@ejemplo.com', // Un correo de contacto
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
);

require('./database/postgresql.js');

const loginRoutes = require('./routes/loginRoutes');
const inicioMaestroRoutes = require('./routes/maestro/inicioMaestroRoutes');
const inicioUsuariosRoutes = require('./routes/usuario/inicioUsuariosRoutes');
const inicioAdministradorRoutes = require('./routes/administrador/inicioAdministradorRoutes');
const { verificarSesion } = require('./middleware/auth');
//SERVIDOR
const app = express();


//configuracion para enviar las push
app.use(morgan('dev'));
app.use(express.json());


//SESSION PARA LAS RUTAS 
const session = require('express-session');
const { log } = require('console');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Aggtcraft1',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

//RUTAS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/', function (req, res) {
    console.log('Ruta raíz accedida: http://localhost:3000');
    res.render('login');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/administrador/inicioAdministrador',verificarSesion, function (req, res) { res.render('administrador/inicioAdministrador'); });
app.get('/maestro/inicioMaestros',verificarSesion, function (req, res) { res.render('maestro/inicioMaestros'); });
app.get('/usuario/inicioUsuarios',verificarSesion, function (req, res) {
    res.render('usuario/inicioUsuarios', { publicVapidKey: process.env.PUBLIC_VAPID_KEY || '' });
});

app.use(loginRoutes);

app.use(verificarSesion, inicioAdministradorRoutes);
app.use(verificarSesion, inicioMaestroRoutes);
app.use(verificarSesion, inicioUsuariosRoutes);

//INICIAR SERVIDOR
app.listen(3000, function () {
    console.log('Servidor creado correctamente: http://localhost:3000');
});

module.exports = app;