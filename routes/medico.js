var express = require('express');
var app = express();
var Medico = require('../models/medico');

var mdAutenticacion = require('../middlewares/autenticacion');

// ======================================================
// Listado de medicos
// ======================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .skip(desde)
        .limit(5)
        .exec(((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    medicos: medicos
                });
            });

        }));
});

// ======================================================
// Crear un medico
// ======================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.id_hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error guardadndo medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});

// ======================================================
// Actualizar Medico
// ======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: { message: " No existe un medico con ese ID" }
            });
        }

        medico.nombre = body.nombre;
        // if (body.img) {
        //     medico.img = body.img;
        // }
        medico.usuario = req.usuario._id;
        medico.hospital = body.id_hospital;

        medico.save((err, medicoModificado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Datos no válidos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoModificado
            });
        });

    });

});

// ======================================================
// Borrar Medico
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico a borrar',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;