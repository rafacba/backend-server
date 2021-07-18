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