'use strict'

var mongoose = require ('mongoose');
var mongoosePag  = require('mongoose-paginate');

var Schema = mongoose.Schema;


var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var picSchema = mongoose.model('picschema', schema);