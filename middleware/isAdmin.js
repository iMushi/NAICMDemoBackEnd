'use strict'

exports.isAdmin = (req,res,next) => {
    if(req.user.role != 'ROLE_ADMIN'){
        return res.status(200).send({message:"Solo Administradores en este Metodo"});
    }
}
