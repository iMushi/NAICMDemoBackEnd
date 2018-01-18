'use strict'

let Empresa = require('../models/empresa')
let Enrol = require('../models/enrolPerson');
let CatEmpresa = require('../models/catempresa');
let Eventual = require('../models/eventual');
let CargaMasiva = require('../models/cargamasiva');

let fs = require('fs-extra');
let path = require('path');
let csv = require('csv');
let Log = require('log');
let unzip = require('unzip');
let shell = require('shelljs');
let fileExists = require('file-exists');
let moment = require('moment');

let response = {status: 200, data: [], message: null};

let searchEnrol = (req, res) => {

    let query = req.query;
    let pageNumber = req.query.page;
    let limite = req.query.maxPerPage;
    let idEmpresa = req.query.idEmpresa;

    delete query.page;
    delete query.maxPerPage;
    delete query.idEmpresa;

    if (idEmpresa) { //Buscar primero id's de empresa

        Empresa.find({
            idEmpresa: {$in: [idEmpresa]}
        }).then(
            empresas => buscaFinal(empresas.map(x => x._id))
        ).catch();

    } else {
        buscaFinal();
    }

    function buscaFinal(empresas) {

        if (empresas) {
            query.empresa = {$in: empresas};
        }

        Enrol.paginate(query, {
                page: pageNumber,
                limit: Number(limite),
                populate: {path: 'empresa', populate: {path: 'idEmpresa'}}
            },
            (err, enrol) => {
                if (err) return errorHandler(err);
                if (!enrol.docs) return emtpyHandler(res);
                return fulfilled(res, req, enrol);
            });
    }

};

let searchEmpresa = (req, res) => {

    let empresa = req.query.q.toUpperCase();
    let query = `this.nombreEmpresa.toUpperCase().includes("${empresa}")`;
    CatEmpresa.find({}).$where(query).then(
        empresas => fulfilled(res, req, empresas, true)
    ).catch(
        err => errorHandler(req, res, err)
    );
}

let saveEnrol = (req, res) => {

    let _id = req.body._id;
    let params = req.body;

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

    if (req.files) {

        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2];
        let file_ext = file_name.split('\.')[1];

        let oldImage = req.params.imageid;

        if (oldImage && oldImage !== 'null') {
            let oldImgPath = `./uploads/enrolPerson/${oldImage}`;
            fs.unlink(oldImgPath, (err) => {
                console.log("Error al borrar Foto Anterior");
                console.log(err);
            });
        }

        if (file_ext === 'png' || file_ext === 'jpg') {

            Enrol.findByIdAndUpdate({_id: req.params.id}, {image: file_name}, {new: true}, (err, updateEnrol) => {

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

        } else {
            fs.unlink(file_path, (err) => {
                console.log("Error al borrar el archivo");
                console.log(err);
            });
            return fulfilled(res, req, {message: "Extension no valida"});
        }

    } else {
        return fulfilled(res, req, {message: "No se ha cargado Imagen"});
    }
};

let saveImageEventual = (req, res) => {

    if (req.files) {

        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let file_ext = file_name.split('\.')[1];


        if (file_ext === 'png' || file_ext === 'jpg') {

            Eventual.findByIdAndUpdate({_id: req.params.id}, {imageBase64: file_name}, {new: true}, (err, updateEventual) => {

                if (err) {
                    res.status(500).send({message: "Error => Update Image on Enrol"});
                } else {
                    if (!updateEventual) {
                        res.status(404).send({message: "Enrol Not Found"});
                    } else {

                        response.status = 200;
                        response.message = "Acceso Eventual se ha creado.";
                        response.data = updateEventual;

                        return fulfilled(res, req, response);
                    }
                }
            });

        } else {
            fs.unlink(file_path, (err) => {
                console.log("Error al borrar el archivo");
                console.log(err);
            });
            return fulfilled(res, req, {message: "Extension no valida"});
        }

    } else {
        return fulfilled(res, req, {message: "No se ha cargado Imagen"});
    }


}

let getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/enrolPerson/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({message: "Imagen no existe"});
        }
    });
};

let getImagePreEnrol = (req, res) => {
    var imageFile = './' + req.params.imageFile.replace(/\|/g, '/');

    console.log(imageFile);

    fs.exists(imageFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(imageFile));
        } else {
            res.status(404).send({message: "Imagen no existe"});
        }
    });
};

let getResultCarga = (req, res) => {
    var logFile = './cargaMasivaLogs/' + req.params.logFile.replace(/\|/g, '/');

    console.log(logFile);

    fs.exists(logFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(logFile));
        } else {
            res.status(404).send({message: "Archivo no existe"});
        }
    });
};

let cargaZip = (req, res) => {

    let horaUpload = moment().format().replace(/T/, ' ').replace(/\..+/, '');
    let uploadPath = './uploads/cargaZip/' + req.user.email + '/' + horaUpload;

    shell.mkdir('-p', uploadPath);

    let carga = new CargaMasiva();

    carga.idUser = req.user.sub;
    carga.idBatch = horaUpload;

    carga.save().then();

    fs.createReadStream(req.files.csvCargaZip.path)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            var fileName = entry.path;

            entry.pipe(fs.createWriteStream(uploadPath + '/' + fileName));

        })
        .on('close', function () {
                req.fechaCargaMasiva = horaUpload;
                return cargaMasiva(req, res);
            }
        );
};

let cargaMasiva = (req, res) => {

    let user = req.user.email;
    let fechaCargaMasiva = req.fechaCargaMasiva;

    var parser = csv.parse({delimiter: ';'}, function (err, cvsData) {




        let rutaLogs = `./cargaMasivaLogs/${user}/${fechaCargaMasiva}`;
        shell.mkdir('-p', rutaLogs);

        let logger = new Log('info', fs.createWriteStream(rutaLogs + '/cargaMasiva.log'));
        let loggerError = new Log('error', fs.createWriteStream(rutaLogs + '/errorCargaMasiva.log'));

        var jarPromises = [];

        let validateDuplicado = (values) => {
            return new Promise((resolve, reject) => {
                if (values.length > 0) { // ya existe ese RFC, registro duplicado
                    reject(new Error(`Registro duplicado con RFC ${values[0].rfc}`));
                } else {
                    resolve();
                }
            });
        };
        let validateEmpresa = (rowNumber, empresasId, regData) => {
            return new Promise((resolve, reject) => {
                CatEmpresa.paginate({'idPublico': {$in: empresasId}}, {page: 1, limit: 10}, (err, catRes) => {
                    if (catRes.total == empresasId.length) {
                        resolve(catRes.docs.map(x => x._id));
                    } else {
                        reject(new Error(`Empresa Invalida. Fila==>${rowNumber}. ${regData[1]} ${regData[2]} ${regData[3]}`));
                    }
                });
            });
        }
        let saveEmpresaInfo = (empresas, ocup, fechas) => {
            let tmpGuardar = [];

            empresas.forEach((item, index) => {
                let empresaG = new Empresa();
                empresaG.idEmpresa = item;
                empresaG.fechaContrato = fechas[index];
                empresaG.ocupacion = ocup[index];
                tmpGuardar.push(empresaG.save());
            });
            return tmpGuardar;
        }
        let guardarInfo = (data, empresas, rutaImagenes) => {

            let enrolado = new Enrol();

            enrolado.nombre = data[1].trim().toUpperCase();
            enrolado.apellidoPaterno = data[2].trim().toUpperCase();
            enrolado.apellidoMaterno = data[3].trim().toUpperCase();

            enrolado.fechaNacimiento = data[4].trim().toUpperCase();
            enrolado.lugarNacimiento = data[5].trim().toUpperCase();
            enrolado.sexo = data[6].trim().toUpperCase();
            enrolado.direccion = data[7].trim().toUpperCase();
            enrolado.codigoPostal = data[8].trim().toUpperCase();
            enrolado.telefono = data[9].trim().toUpperCase();
            enrolado.telefonoEmergencia = data[10].trim().toUpperCase();
            enrolado.contactoEmergencia = data[11].trim().toUpperCase();
            enrolado.accesoOtorgado = data[12].trim().toUpperCase();
            enrolado.motivoAcceso = data[13].trim().toUpperCase();
            enrolado.nss = data[14].trim().toUpperCase();
            enrolado.rfc = data[15].trim().toUpperCase();
            enrolado.estadoCivil = data[16].trim().toUpperCase();
            enrolado.tipoSangre = data[17].trim().toUpperCase();
            enrolado.registroPatronal = data[20].trim().toUpperCase();

            enrolado.seniasParticulares = data[22].trim().toUpperCase();
            enrolado.licencia = data[23].trim().toUpperCase();
            enrolado.tipoLicencia = data[24].trim().toUpperCase();

            enrolado.rutaImagenes = rutaImagenes;

            // enrolado.empresa   // este es para despues.
            // Campos Vacios, se llenan en el enrolamiento
            enrolado.image = '';
            enrolado.enrolComplete = 'false'; //Enrolado en false
            enrolado.enrolActive = 'false'; //Enrolado Activo en false
            enrolado.empresaCredId = '';
            enrolado.biometricoFinal = '';
            enrolado.empresa = empresas.map(x => x._id);
            return enrolado.save();
        }
        let validateFiles = (regData, user, fechaCargaMasiva) => {

            return new Promise((resolve, reject) => {
                let rowNumber = regData[0];
                let licencia = regData[23];
                let ruta = `./uploads/cargaZip/${user}/${fechaCargaMasiva}`;

                let errorStr = '';
                let ifeFile = `/${rowNumber}_IFE.jpg`;

                let rutaImagenes = [
                    ruta + ifeFile
                ];

                if (!fileExists.sync(ruta + ifeFile)) {
                    errorStr += `Archivo IFE no encontrado (${ifeFile}).`;
                }

                if (!!licencia) {
                    let licFile = `/${rowNumber}_LICENCIA.jpg`;
                    let tarjFile = `/${rowNumber}_TARJETA.jpg`;

                    if (!fileExists.sync(ruta + licFile)) {
                        errorStr += `Archivo LICENCIA no encontrado (${licFile}).`;
                    }
                    if (!fileExists.sync(ruta + tarjFile)) {
                        errorStr += `Archivo TARJETA no encontrado (${tarjFile}).`;
                    }
                    rutaImagenes.push(ruta + licFile);
                    rutaImagenes.push(ruta + tarjFile);
                }

                if (!!errorStr) {
                    reject(new Error(`Error Procesando Archivos Fila ==> ${rowNumber} ${errorStr}`));
                } else {
                    resolve(rutaImagenes);
                }

            });
        };

        cvsData.forEach(dataCsv => {
            jarPromises.push(
                function () {
                    const regData = this;
                    const rfcValidacion = regData[15].trim().toUpperCase();
                    const rowNumber = regData[0];
                    const empresasId = regData[19].trim().split('|')   //Id's de empresa
                    const ocupaciones = regData[18].trim().split('|')  //ocupaciones de las empresas
                    const fechasContratos = regData[21].trim().split('|')// fechas de contratos
                    let rutaImagenes;
                    console.log(regData);
                    return new Promise((resolve, reject) => {
                        Enrol.find({rfc: rfcValidacion}).then(
                            validateDuplicado
                        ).then(_ => {
                                return validateFiles(regData, user, fechaCargaMasiva);
                            }
                        ).then(ruta => {
                                rutaImagenes = ruta;
                                return validateEmpresa(rowNumber, empresasId, regData);
                            }
                        ).then(
                            idEmpresas => {
                                return Promise.all(saveEmpresaInfo(idEmpresas, ocupaciones, fechasContratos));
                            }
                        ).then(
                            empresasInfo => {
                                return guardarInfo(regData, empresasInfo, rutaImagenes);
                            }
                        ).then(
                            resolve
                        ).catch(reject)
                    });
                }.bind(dataCsv[0].split(','))
            );
        });

        jarPromises.reduce((promiseChain, currentTask) => {
            return promiseChain.then(chainResults =>
                currentTask().then(currentResult =>
                    [...chainResults, currentResult]
                ).catch(currentResult =>
                    [...chainResults, currentResult]
                )
            );
        }, Promise.resolve([])).then(arrayOfResults => {

            arrayOfResults.forEach(function (item, index) {

                if (item instanceof Error) {
                    loggerError.error(item.message);
                } else {
                    logger.info(`Registro Exitoso ==> ${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno} ${item.rfc}`);
                }
            })

        });
    });

    fs.createReadStream(req.files.csvCargaMasiva.path).pipe(parser);

    return res.status(200).send({message: "Los Archivos han sido Cargados y seran Procesados."});
};

let saveEventual = (req, res) => {

    let params = req.body;
    let eventual = new Eventual();

    eventual.nombre = params.nombre;
    eventual.apellidoPaterno = params.apellidoPaterno;
    eventual.apellidoMaterno = params.apellidoMaterno;
    eventual.telefono = params.telefono;
    eventual.telefonoEmergencia = params.telefonoEmergencia;
    eventual.ocupacion = params.ocupacion;
    eventual.accesoOtorgado = params.accesoOtorgado;
    eventual.motivoAcceso = params.motivoAcceso;
    eventual.imageBase64 = params.imageBase64;
    eventual.idEmpresa = params.idEmpresa;
    eventual.fechaAcceso = new Date();

    eventual.save().then(
        enrol => {
            return fulfilled(res, req, enrol);
        }
    ).catch(
        err => {
            return errorHandler(req, res, err);
        }
    );

};

let getEventuales = (req, res) => {

    let maxPage = req.query.maxPerPage;
    let page = req.query.page;

    Eventual.paginate({}, {
        page: page, limit: Number(maxPage),
        populate: 'idEmpresa'
    }, (err, eventual) => {
        if (err) return errorHandler(req, res, err);
        if (!eventual.docs) return emtpyHandler(res);
        fulfilled(res, req, eventual);
    });

};

let getCargaMasiva = (req, res) => {

    let idUser = req.params.idUser;
    let maxPage = req.query.maxPerPage;
    let page = req.query.page;

    CargaMasiva.paginate({
        idUser: idUser
    }, {
        page: page, limit: Number(maxPage),
        populate: 'idUser'
    }, (err, eventual) => {
        if (err) return errorHandler(req, res, err);
        if (!eventual.docs) return emtpyHandler(res);
        fulfilled(res, req, eventual);
    });

};

let resetInfo = (req,res) => {

    Enrol.remove({}, err => {});
    Eventual.remove({}, err => {});
    CargaMasiva.remove({}, err => {});
    Empresa.remove({}, err => {});

    const directory = './uploads/enrolPerson/';

    delfiles('./uploads/enrolPerson/');
    delfiles('./uploads/cargaZip/');
    delfiles('./cargaMasivaLogs/');

    function delfiles (directory) {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                if (file.includes('.keep')){
                    continue;
                }
                fs.remove(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }


    response.status=200;
    response.message='Limpiado Correcto';

    return fulfilled(res, req,response);
}

const errorHandler = (req, res, err) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    return res.status(501).json(response);
};

const emtpyHandler = (res) => {
    return res.status(200).send({message: "No se encontraron Personas"});
};

const fulfilled = (res, req, data, noAuth) => {
    if (!noAuth) cookieHandler(res, req);
    return res.status(200).send(data);
};

const cookieHandler = (res, req) => {
    res.cookie('NAICM', req.headers.cookie.split("=")[1], {expires: new Date(Date.now() + (3600 * 900)), httpOnly: true, path: '/'});
};

const delay = (seconds) => {
     var waitTill = new Date(new Date().getTime() + seconds * 1000);
     while(waitTill > new Date()){
     }
}

module.exports = {
    searchEnrol,
    saveEnrol,
    saveEnrolImage,
    getImageFile,
    cargaMasiva,
    searchEmpresa,
    saveEventual,
    getEventuales,
    saveImageEventual,
    cargaZip,
    getImagePreEnrol,
    getCargaMasiva,
    getResultCarga,
    resetInfo
}
