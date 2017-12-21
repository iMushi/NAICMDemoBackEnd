'use strict'

var mongoose = require ('mongoose');
var mongoosePag  = require('mongoose-paginate');

var Schema = mongoose.Schema;

var catEmpresaSchema = new Schema({
    nombreEmpresa: String,
    idPublico: Number
});

catEmpresaSchema.plugin(mongoosePag);

module.exports  = mongoose.model('CatEmpresa', catEmpresaSchema);
