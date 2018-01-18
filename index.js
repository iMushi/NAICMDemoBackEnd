'use strict'

var mongoose = require('mongoose')
var app = require('./app');
var fs = require('fs');
var https = require('https');
var env = require('dotenv').config();


mongoose.Promise = global.Promise;


if (process.env.ENV === 'local') {
    var mongoURI = process.env.MDBURI;
    var port = process.env.PORT;


} else {
    var privateKey = fs.readFileSync('certificates/key.pem', 'utf8');
    var certificate = fs.readFileSync('certificates/cert.pem', 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    var port = 8443;
    var mongoURI = 'mongodb://heroku_tqf52q58:q3uoqqehp1547bb721tt7e1872@ds133746.mlab.com:33746/heroku_tqf52q58';
}


mongoose.connect(mongoURI, {useMongoClient: true}).then(
    _ => {
        console.log('conectado a MongoDB ====> ' + mongoURI);

        if (process.env.ENV === 'local') {
            app.listen(port, _ => {
            });
        } else {

            var httpsServer = https.createServer(credentials, app);
            httpsServer.listen(port);
        }

    }
).catch(
    err => {
        console.log("Error al conectar a MongoDB =====> " + err);
    }
)






