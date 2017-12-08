'use strict'

var mongoose = require('mongoose')
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ZOO',{useMongoClient:true}).then(
    () =>{
    console.log('Conexion Exitosa');
    app.listen(port,_ => {
      console.log('Servidor Corriendo');
    });
  }
).catch(err => console.log(err));
