'use strict'


/*
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YTFkMDc2MTQzNWU0ZDJhZTExMWVjMDUiLCJuYW1lIjoiZ2FicmllbCIsInN1cm5hbWUiOiJsb3BleiIsImVtYWlsIjoiaW11c2hpQG1lLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNTExOTA2MjU5fQ.XEg_uv4e1yQzz8HmbqHn9JK0Glgb5f54BJJVg0MDb0k
*/

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveSecreta';

exports.ensureAuth = (req, res, next) => {

    let cookie = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;

    if(!cookie ){
        cookie = req.headers.authorization ? req.headers.authorization.split("=")[1] : null;
    }

    console.log("====> cookie =====>");
    console.log(cookie);

    if(!cookie){
        return res.status(403).send({message:'Forbidden'});
    }

    var token = cookie.replace(/['"]+/g,'');

    try{
        var payload = jwt.decode(token,secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'Token Expirado'});
        }

    }catch(ex){
        return res.status(403).send({message:'Token Invalido'});
    }

    req.user = payload;

    next();



    /* Codigo Original
    if(!req.headers.authorization){
    return res.status(403).send({message:'Forbidden'});
}

var token = req.headers.authorization.replace(/['"]+/g,'');

try{
var payload = jwt.decode(token,secret);

if(payload.exp <= moment().unix()){
return res.status(401).send({message:'Token Expirado'});
}

}catch(ex){
return res.status(404).send({message:'Token Invalido'});
}

req.user = payload;

next();
*/
};
