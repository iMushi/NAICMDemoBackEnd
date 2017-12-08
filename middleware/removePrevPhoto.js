var fs = require('fs');


exports.remPrev = (req,res,next) => {
    fs.unlink('uploads/enrolPerson/' + req.params.id +'.png', (err)=>{
        console.log(err);
        next();
    });
}