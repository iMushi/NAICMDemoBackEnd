'use strict'

var mongoose = require('mongoose')
var app = require('./app');
var port = process.env.PORT || 5000;
var mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ZOO"; //Configuración del servidor o localhost

mongoURI = "mongodb://heroku_tqf52q58:q3uoqqehp1547bb721tt7e1872@ds133746.mlab.com:33746/heroku_tqf52q58";


//kJSFiiPXdFWxceWK

mongoose.Promise = global.Promise;


const Mongod = require('mongod');

// Simply pass the port that you want a MongoDB server to listen on.
//const server = new Mongod({
 //   bin : '/Sandbox/mongodb/bin/mongod',
 //   port : '27017'
//});



//server.open((err) => {
//    console.log(err);
//    if (err === null) {

        mongoose.connect(mongoURI, {useMongoClient: true}).then(
            _ => {
                console.log("conectado a MongoDB ====> " + mongoURI);

                app.listen(port, _ => {
                    console.log('Servidor Corriendo');
                });

            }
        ).catch(
            err => {
                console.log("Error al conectar a MongoDB =====> " + err);
                server.close( _ => {} );
            }
        )
//    }
//});






