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
api.post('/saveEnrolImage/:id' , [md_auth.ensureAuth,md_rem.remPrev, md_upload] ,  EnrolController.saveEnrolImage );
api.get('/getImageEnrol/:imageFile'  ,  EnrolController.getImageFile );



api.get('/heroku' , (req, res) => {
   res.status(200).send({message:"desde Heroku"});
});



module.exports = api;
