// Requires Librerias necesarias
var express = require('express');
var mongoose = require('mongoose');

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Inicializar Variable
var app = express();

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

// Rutas las paso a un drectorio routes para mas prolijidad 
app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server P3000: \x1b[32m%s\x1b[0m', 'online');
});