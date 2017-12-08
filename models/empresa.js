'use strict'

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = new Schema({
    nombreEmpresa : String,
    fechaContrato : String,
    ocupacion : String
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
