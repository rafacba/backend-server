var express = require('express');
// Para encriptar la contraseña uso npm install bcryptjs --save
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

// ======================================================
// Obtener todos los usuarios
// ======================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //Si viene un parametro lo uso sino uso cero

    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google') //No quiero que me traiga el password para mostrar
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                Usuario.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        usuarios: usuarios
                    });
                });


            });

});

// ======================================================
// Verificar token - Va despues de obtener todos los usuarios porque 
// ese get lo puede hacer cualquiera pero lo que sigue solo lo hace alguien logueado
// todo lo que sigue despues de este middleware va a requerir un jwt
// ======================================================
// Pasado a autenticacion.js como middleware para usarlo en varios lados
// app.use('/', (req, res, next) => {
//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Usuario no autorizado',
//                 errors: err
//             });
//         }

//         next(); // permite continuar con todo lo que sigue abajo, sino se queda clavado
//     });

// });

// ======================================================
// Crear un nuevo usuario
// ======================================================


//como segundo parametro mando las validaciones --> si es una sola
// pongo  ej mdAut.verificar y sii son varias las pongo entre [mdAut.verif1,mdAut.verif2]
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardadndo usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});

// ======================================================
// Actualizar Usuario
// ======================================================
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario con este id: ' + id,
                errors: { message: " No existe un usuario con ese ID" }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioModificado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Datos no validos al actualizar',
                    errors: err
                });
            }

            usuarioModificado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioModificado
            });
        });

    });

});

// ======================================================
// Borrar un usuario por id
// ======================================================
app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res, next) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;