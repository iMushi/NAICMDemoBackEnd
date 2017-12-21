'use strict'

var mongoose = require ('mongoose');
var mongoosePag  = require('mongoose-paginate');

var Schema = mongoose.Schema;


var EnrolPersonSchema = new Schema({
    nombre: String,             //1
    apellidoPaterno : String,   //2
    apellidoMaterno: String,    //3
    fechaNacimiento: String,    //4
    lugarNacimiento: String,    //5
    sexo: String,               //6
    direccion : String,         //7
    codigoPostal: String,       //8
    telefono: String,           //9
    telefonoEmergencia: String, //10
    contactoEmergencia: String, //11
    accesoOtorgado: String,     //12
    motivoAcceso: String,       //13

    nss: String,                //14
    rfc: String,                //15

    estadoCivil: String,        //16
    tipoSangre: String,         //17


    registroPatronal: String,   //20

    seniasParticulares : String, //22
    licencia : String,          //23
    tipoLicencia : String,      //24


    empresa : [{  type : Schema.ObjectId ,ref :'Empresa' }],

    rutaImagenes : String,

    image : String,
    enrolComplete : Boolean,
    enrolActive : Boolean,
    empresaCredId : String
});


EnrolPersonSchema.plugin(mongoosePag);

module.exports = mongoose.model('Enrol', EnrolPersonSchema);
