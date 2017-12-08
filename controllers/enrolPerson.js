'use strict'


//modelos
var Empresa = require('../models/empresa')
var Enrol = require('../models/enrolPerson');
var fs = require('fs');
var path = require('path');


let searchEnrol = (req, res) => {

    let query = req.query;

    Enrol.find(query).exec((err, enrol) => {

        if (err) return errorHandler(err);
        if (!enrol.length) return emtpyHandler(res);

        var tmpEnrol = [];

        enrol.forEach(itemEnrol => {
            tmpEnrol.push(Enrol.populate(itemEnrol, {path: 'empresa'}));
        });

        Promise.all(tmpEnrol).then(values => {
            fulfilled(res, req, values);
        }, reason => {
            return errorHandler(req,res,reason);
        });
    });
};


let saveEnrol = (req, res) => {

    let _id = req.body._id;
    let params = req.body;

    params.image = _id;

    Enrol.findByIdAndUpdate(_id, params, {new: true}, (err, enrolUpdated) => {

        if (err) {
            res.status(500).send({message: "Error => Update on Enrol"});
        } else {
            if (!enrolUpdated) {
                res.status(404).send({message: "Enrol Not Found"});
            } else {
                return fulfilled(res, req, enrolUpdated);
            }
        }

    });

}


let saveEnrolImage = (req, res) => {

    Enrol.findByIdAndUpdate({_id: req.params.id}, {image: req.params.id}, {new: true}, (err, updateEnrol) => {

        if (err) {
            res.status(500).send({message: "Error => Update Image on Enrol"});
        } else {
            if (!updateEnrol) {
                res.status(404).send({message: "Enrol Not Found"});
            } else {
                return fulfilled(res, req, updateEnrol);
            }
        }
    });
}



let getImageFile = (req, res)=>{
    var imageFile = req.params.imageFile;
    var path_file = './uploads/enrolPerson/'+imageFile+'.png';

    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Imagen no existe"});
        }
    });
};



let errorHandler = (req,res,error) => {
    return res.status(200).send({error});
};

let emtpyHandler = (res) => {
    return res.status(200).send({message: "No se encontraron Personas"});
};
let fulfilled = (res, req, data) => {
    cookieHandler(res, req);
    return res.status(200).send(data);
};
let cookieHandler = (res, req) => {
    res.cookie('NAICM', req.headers.cookie.split("=")[1], {expires: new Date(Date.now() + (3600 * 900)), httpOnly: true});
};

module.exports = {
    searchEnrol,
    saveEnrol,
    saveEnrolImage,
    getImageFile
}
