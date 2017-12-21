'use strict'

var express = require('express');
var fs = require('fs');
var EnrolController = require('../controllers/enrolPerson');
var api = express.Router();
var md_auth = require('../middleware/auth');
var md_isAdmin = require('../middleware/isAdmin');
var multipart = require('connect-multiparty'); //Editar metodo uploadPath en index.js de multiparty
var md_upload = multipart({uploadDir : './uploads/enrolPerson'});
var md_rem = require('../middleware/removePrevPhoto');

api.get('/searchEnrol' , md_auth.ensureAuth ,  EnrolController.searchEnrol );
api.post('/saveEnrol' , md_auth.ensureAuth ,  EnrolController.saveEnrol );
api.post('/saveEnrolImage/:id/:imageid' , [md_auth.ensureAuth,md_rem.remPrev, md_upload] ,  EnrolController.saveEnrolImage );
api.post('/saveImageEventual/:id' , [md_auth.ensureAuth, md_upload] ,  EnrolController.saveImageEventual );

api.get('/getImageEnrol/:imageFile'  ,  EnrolController.getImageFile );
api.get('/getImagePreEnrol/:imageFile'  ,  EnrolController.getImagePreEnrol );
api.get('/getResultCarga/:logFile' ,  EnrolController.getResultCarga );


api.post('/cargaMasiva', [md_auth.ensureAuth,md_upload],  EnrolController.cargaMasiva);
api.get('/searchEmpresa'  ,  EnrolController.searchEmpresa );
api.post('/saveEventual', md_auth.ensureAuth,  EnrolController.saveEventual);
api.get('/getEventuales' , md_auth.ensureAuth ,  EnrolController.getEventuales );

api.post('/cargaZip' ,[md_auth.ensureAuth,md_upload], EnrolController.cargaZip);
api.get('/getCargaMasiva/:idUser' , md_auth.ensureAuth, EnrolController.getCargaMasiva);


module.exports = api;
