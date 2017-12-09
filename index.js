'use strict'

var mongoose = require('mongoose')
var app = require('./app');
var port = process.env.PORT || 5000;
var mongoURI = process.env.MDBURI || "mongodb://heroku_tqf52q58:q3uoqqehp1547bb721tt7e1872@ds133746.mlab.com:33746/heroku_tqf52q58";

mongoose.Promise = global.Promise;

/*
mongoose.connect('mongodb://localhost:27017/ZOO',{useMongoClient:true}).then(
    () =>{
    console.log('Conexion Exitosa');
    app.listen(port,_ => {
      console.log('Servidor Corriendo');
    });
  }
).catch(err => console.log(err));
*/


mongoose.connect(mongoURI,{useMongoClient:true}).then(
    _ => {
        console.log("conectado a MongoDB");

        app.listen(port,_ => {
            console.log('Servidor Corriendo');
        });

    }
).catch(
    err => console.log("Error al conectar a MongoDB =====> " + err)
)

