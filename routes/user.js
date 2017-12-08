'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middleware/auth');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './uploads/users'});

api.get('/pruebas-del-controlador' , md_auth.ensureAuth ,UserController.pruebas );
api.post('/register' , UserController.saveUser );
api.post('/login' , UserController.login );
api.post('/logout', md_auth.ensureAuth , UserController.logout );
api.put('/update-user/:id' ,  md_auth.ensureAuth , UserController.updateUser );
api.post('/upload-image-user/:id' ,  [md_auth.ensureAuth, md_upload] , UserController.uploadImagen );
api.get('/get-image-file/:imageFile' ,  UserController.getImageFile );
api.get('/get-keepers' ,  UserController.getKeepers );

api.post('/validate' ,[md_auth.ensureAuth], UserController.validateToken);

module.exports = api;
