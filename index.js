'use strict'

var mongoose = require('mongoose')
var app = require('./app');
var port = process.env.PORT || 5000;
var mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ZOO"; //Configuración del servidor o localhost

//kJSFiiPXdFWxceWK

mongoose.Promise = global.Promise;

mongoose.connect(mongoURI,{useMongoClient:true}).then(
    _ => {
        console.log("conectado a MongoDB ====> "  + mongoURI);

        app.listen(port,_ => {
            console.log('Servidor Corriendo');
        });

    }
).catch(
    err => console.log("Error al conectar a MongoDB =====> " + err)
)

