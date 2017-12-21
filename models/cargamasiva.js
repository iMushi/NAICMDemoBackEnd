'use strict'

var mongoose = require ('mongoose');
var mongoosePag  = require('mongoose-paginate');

var Schema = mongoose.Schema;


var CargaSchema = new Schema({
    idUser: {  type : Schema.ObjectId ,ref :'User' },
    fechaCreacion : {type:Date , default : Date.now() },
    idBatch : String
});


CargaSchema.plugin(mongoosePag);

module.exports = mongoose.model('CargaSchema', CargaSchema);
