// Requires Librerias necesarias
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variable
var app = express();

// Conexion a la BD - Ver en mongoosejs.com 
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
//     if (err) throw err;
//     console.log('Base de Datos : \x1b[32m%s\x1b[0m', 'conectada');
// });
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de Datos : \x1b[32m%s\x1b[0m', 'conectada');
});


// Ejemplo de Hello World
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server P3000: \x1b[32m%s\x1b[0m', 'online');
});