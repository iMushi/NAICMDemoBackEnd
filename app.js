'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');
var enrol_routes = require('./routes/enrolPerson');

//boddy parser
/*
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
*/

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//cabeceras y CORS

app.use( (req,res,next)=>{

    //res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Origin' , req.headers.origin );
    res.header('Access-Control-Allow-Headers','Authorization,Set-Cookie, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS,PUT,DELETE');
    res.header('Allow','GET, POST, OPTIONS,PUT,DELETE');
    next();

});

//rutas base
app.use('/api',user_routes);
app.use('/api',animal_routes);

app.use('/api',enrol_routes);
//module exports
module.exports = app;
