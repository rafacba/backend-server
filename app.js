// Requires Librerias necesarias
var express = require('express');
var mongoose = require('mongoose');

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Inicializar Variable
var app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    next();
});

//Body Parser ya no hace falta instalar body parser xq express lo incorpora
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies


// Conexion a la BD - Ver en mongoosejs.com 
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
//     if (err) throw err;
//     console.log('Base de Datos : \x1b[32m%s\x1b[0m', 'conectada');
// });
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de Datos : \x1b[32m%s\x1b[0m', 'conectada');
});


// Ejemplo de Hello World
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

// Server Index Config
//Sirve para ver imagenes en localhost:3000/uploads
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas las paso a un drectorio routes para mas prolijidad 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server P3000: \x1b[32m%s\x1b[0m', 'online');
});