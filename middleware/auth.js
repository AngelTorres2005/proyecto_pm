const verificarSesion = (req, res, next) => {
    if (req.session && req.session.idUsuario) {
        return next(); 
    } else {
        res.redirect('/login'); 
    }
};

module.exports = { verificarSesion};