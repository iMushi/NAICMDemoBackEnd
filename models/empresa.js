'use strict'

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = new Schema({
    idEmpresa : {  type : Schema.ObjectId ,ref :'CatEmpresa' },
    nombreEmpresa : String,
    fechaContrato : String,
    ocupacion : String
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
