var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs'); //Importa libreria de fileSystem

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

var app = express();

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Validar tipos permitidos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo no es valido',
            errors: { message: 'Solo se admiten ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Verificar que el archivo sea una imagen
    var archivo = req.files.imagen; //Nombre y ext del archivo
    var cortaNombre = archivo.name.split('.'); //separo todo en cada punto
    var extension = cortaNombre[cortaNombre.length - 1]; //tomo el ultimo elemento = extension

    //Solo estas extensiones son aceptadas
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //Validar extension
    if (extValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Solo se admiten ' + extValidas.join(', ') }
        });
    }

    //Crear nombre archivo personalizado --> idusuario-123.jpg
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Mover archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el archivo',
                errors: err
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res);

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Archivo guardado correctamente',
    //     ext: extension,
    //     nombreArchivo: nombreArchivo
    // });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el usuario',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            // Elimina la imagen anterior si es que existe
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
                // try {
                //     fs.unlinkSync(pathViejo);
                //     console.log('File removed');
                // } catch (e) {
                //     console.error('Something wrong happened removing the file', e);
                // }
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada corectamente',
                    usuario: usuarioActualizado,
                    old: pathViejo
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el medico',
                    errors: { message: 'Medico no existe' }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            // Elimina la imagen anterior si es que existe
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada corectamente',
                    medico: medicoActualizado,
                    old: pathViejo
                });
            });
        });

    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el Hospital',
                    errors: { message: 'Hospital no existe' }
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            // Elimina la imagen anterior si es que existe
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada corectamente',
                    hospital: hospitalActualizado,
                    old: pathViejo
                });
            });
        });

    }
}

module.exports = app;