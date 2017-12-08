'use strict'

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var EnrolPersonSchema = new Schema({
    nombre: String,
    apellidoPaterno : String,
    apellidoMaterno: String,
    fechaNacimiento: String,
    lugarNacimiento: String,
    sexo: String,
    codigoPostal: String,
    telefono: String,
    telefonoEmergencia: String,
    contactoEmergencia: String,
    nss: String,
    rfc: String,
    estadoCivil: String,
    tipoSangre: String,
    registroPatronal: String,
    accesoOtorgado: String,
    motivoAcceso: String,
    ocupacion: String,
    empresa : [{  type : Schema.ObjectId ,ref :'Empresa' }],
    image : String,
    enrolComplete : Boolean,
    empresaCredId : String
});


module.exports = mongoose.model('Enrol', EnrolPersonSchema);
