'use strict'
// modulos

var fs = require('fs');
var path = require('path');


var User = require('../models/user');
var Animal = require('../models/animal');

//acciones
let pruebas = (req,res)=>{
    res.status(200).send({
        message : 'Probando el Controlador de Animales y accion Prueba'
        ,user : req.user //Hasta despues de poner middleware y auth
    });
};

let saveAnimal = (req, res)=>{
    var animal = new Animal();

    var params = req.body;

    if(params.name){
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        console.log(animal);

        animal.save( (err,animalStored)=>{
            if(err){
                res.status(500).send({message:"Error al Guardar Animal"});
            }else{
                if(!animalStored){
                    res.status(404).send({message:"No se ha guardado el animal"});
                }else{
                    res.status(200).send({animal:animalStored});
                }
            }
        });
    }else{
        res.status(200).send({message:"Nombre Obligatorio"});
    }

};

let  getAnimals = (req, res) =>{
    Animal.find({}).populate({path : 'user'}).exec((err,animals)=>{
        if(err){
            res.status(500).send({message:"error en la consulta de animales"});
        }else{
            if(!animals){
                res.status(404).send({message:"No hay Animales"});
            }else{
                res.status(200).send({animals : animals});
            }
        }
    });
}

let getAnimal = (req , res) => {
    var animalId = req.params.id;

    Animal.findById(animalId).populate({path : 'user'}).exec((err,animal) =>{
        if(err){
            res.status(500).send({message:"error en la consulta de animales"});
        }else{
            if(!animal){
                res.status(404).send({message:"Animal no Existe"});
            }else{
                res.status(200).send({animal});
            }
        }
    });
};

let updateAnimal = (req, res) => {
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update,{new:true},(err,animalUpdate)=>{
        if(err){
            res.status(500).send({message:"error en la update de animale"});
        }else{
            if(!animalUpdate){
                res.status(404).send({message:"Animal no Actualizado"});
            }else{
                res.status(200).send({animal : animalUpdate});
            }
        }
    });

};

let uploadImagen = (req,res)=>{
    var animalId = req.params.id;
    var file_name = 'No subido';


    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = file_name.split('\.')[1];

        if(file_ext == 'png' || file_ext == 'jpg'){

            Animal.findByIdAndUpdate(animalId, {image: file_name},{new:true},(err ,animalUpdated)=>{
                if(err){
                    res.status(500).send({message:"error al actualizar el Animal con la imagen"});
                }else{
                    if(!animalUpdated){
                        res.status(404).send({message:"error al actualizar el Animal con la imagen"});
                    }else{
                        res.status(200).send({animal : animalUpdated,image:file_name});
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
    var path_file = './uploads/animals/'+imageFile;

    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Imagen no existe"});
        }
    });
};

let deleteAnimal = (req, res) => {
    var animalId = req.params.id;
    Animal.findByIdAndRemove(animalId).exec( (err,animalDeleted) => {
        if(err){
            res.status(500).send({message:"No se pudo borrar Animal"});
        }else{
            if(!animalDeleted){
                res.status(404).send({message:"Animal no Borrado"});
            }else{
                res.status(200).send({message:"Borrado Correctamente"});
            }
        }
    });
};

module.exports ={
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImagen,
    getImageFile,
    deleteAnimal
};
