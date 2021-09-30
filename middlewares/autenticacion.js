var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;



// ======================================================
// Verificar token
// ======================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario no autorizado',
                errors: err
            });
        }

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
        req.usuario = decoded.usuario;
        next(); // permite continuar con todo lo que sigue abajo, sino se queda clavado
    });
};

// ======================================================
// Verificar ADMIN
// ======================================================

exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorecto - No es ADMIN',
            errors: { message: 'No es administrado - no es usuario ADMIN ' }
        });
    }
};

// ======================================================
// Verificar ADMIN o Mismo Usuario
// ======================================================

exports.verificaADMIN_o_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    // console.log(id);
    // console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorecto - No es ADMIN ni el mismo usuario',
            errors: { message: 'No es ADMIN - Solo puede modificar si es el mismo usuario ' }
        });
    }
};