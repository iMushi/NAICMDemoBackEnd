'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
//modelos
var User = require('../models/user');



//Servicio jwt
var jwt = require('../service/jwt');

//acciones
let pruebas = (req,res)=>{
    res.status(200).send({
        message : 'Probando el Controlador de usuarios y accion Prueba'
        ,user : req.user //Hasta despues de poner middleware y auth
    });
};

let saveUser = (req,res) => {

    var user = new User();

    //Obtener Parametros de peticion
    var params = req.body;

    console.log("params ====> ");
    console.log(params);


    if(params.password){
        //Asignar Valores al objeto usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email:user.email.toLowerCase()},(err,userCallback)=>{
            if(err){
                res.status(500).send({message:'Error al Comprobar Usuario'});
            }else{
                if(!userCallback){
                    //Cifrar password
                    bcrypt.hash(params.password , null, null,function(err,hash){
                        user.password = hash;
                        user.save( (err, userStored) => {
                            if(err){
                                res.status(500).send({message:'Error al Guardar Usuario'});
                            }else{
                                if(!userStored){
                                    res.status(404).send({message:'No se ha registrado el usario'});
                                }else{
                                    res.status(200).send({user:userStored});
                                }
                            }
                        });
                    });

                }else{
                    res.status(200).send({message:'El Usuario ya existe'});
                }
            }
        });
    }else{
        res.status(200).send({message:'Introduce todos los datos'});
    }
};

let login = (req, res) => {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email:email.toLowerCase()},(err,userCallback)=>{
        if(err){
            res.status(500).send({message:'Error al Comprobar Usuario'});
        }else{
            if(userCallback){

                bcrypt.compare(password, userCallback.password, (err, check)=>{
                    if(check){


                        var token = jwt.createToken(userCallback);
                        userCallback.password = null;

                        res.cookie('NAICM', token , { expires: new Date(Date.now() + (3600*900) ), httpOnly: true, path : '/' });


                        res.status(200).send({
                            user:userCallback,
                            token : token
                        });
                    }else{
                        res.status(404).send({message:'Usuario y/o Contraseña incorrecta'});
                    }
                });


            }else{
                res.status(404).send({message:'El usuario no existe'});
            }
        }
    });

};


let logout = (req, res) => {
    res.cookie('NAICM', '' , { expires: new Date(0), httpOnly: true });
    res.status(200).send({});
}


let updateUser = (req,res)=>{

    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(200).send({message:"No tienes permiso para actualizar"});
    }

    User.findByIdAndUpdate(userId, update,{new:true},(err ,userUpdated)=>{
        if(err){

            res.status(500).send({message:"error al actualizar el usuario"});

        }else{
            if(!userUpdated){
                res.status(404).send({message:"error al actualizar el usuario"});
            }else{
                res.status(200).send({user : userUpdated});
            }
        }
    });
}

let uploadImagen = (req,res)=>{
    var userId = req.params.id;
    var file_name = 'No subido';


    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = file_name.split('\.')[1];

        if(file_ext == 'png' || file_ext == 'jpg'){

            if(userId != req.user.sub){
                return res.status(200).send({message:"No tienes permiso para actualizar"});
            }

            User.findByIdAndUpdate(userId, {image: file_name},{new:true},(err ,userUpdated)=>{
                if(err){
                    res.status(500).send({message:"error al actualizar el usuario con la imagen"});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message:"error al actualizar el usuario con la imagen"});
                    }else{
                        res.status(200).send({user : userUpdated,image:file_name});
                    }
                }
            });

        }else{
            fs.unlink(file_path, (err) => {
                console.log("Error al borrar el archivo");
            });
            res.status(200).send({message:"Extension no valida"});
        }

    }else{
        res.status(200).send({message:"no se han subido archivos"});
    }

};

let getImageFile = (req, res)=>{
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Imagen no existe"});
        }
    });
};

let getKeepers = (req , res)=>{
    User.find({role:'ROLE_ADMIN'}).exec( (err,users) => {
        if(err){
            res.status(500).send({"message" : "Error en getKeepers ..."});

        }else{
            if(users){
                res.status(200).send({users});
            }else{
                res.status(404).send({"message" : "No Keepers"});
            }
        }
    });
}

let validateToken = (req,res) => {
    res.status(200).send({
        status: 200,
        token : req.headers.auth
    });
};



module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImagen,
    getImageFile,
    getKeepers,
    validateToken,
    logout
}
