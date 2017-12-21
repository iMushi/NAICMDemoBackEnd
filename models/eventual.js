'use strict'

var mongoose = require ('mongoose');
var mongoosePag  = require('mongoose-paginate');

var Schema = mongoose.Schema;


var EventualSchema = new Schema({
    nombre: String,
    apellidoPaterno : String,
    apellidoMaterno: String,
    telefono: String,
    telefonoEmergencia : String,
    ocupacion : String,
    accesoOtorgado : String,
    motivoAcceso : String,
    imageBase64 : String,
    idEmpresa : {  type : Schema.ObjectId ,ref :'CatEmpresa' },
    fechaAcceso : {type:Date , default : Date.now }
});


EventualSchema.plugin(mongoosePag);

module.exports = mongoose.model('Eventual', EventualSchema);
