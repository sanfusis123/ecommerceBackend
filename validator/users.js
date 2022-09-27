const validator = require('validator');


const userValidator = (req , res , next)=>{
        const {name  , email , password } = req.body;
        const error = [];
        if(validator.isEmpty(name) || name.length <4){
            error.push({Name : 'Not Empty least 3 char'})
       }
        if(!validator.isEmail(email)){
             error.push({Email : 'Email is not valid'})
        }
        
        if(validator.isEmpty(password) || password.length <6 ){
            error.push({Password : 'Password must contains number and least 6 character'})
        }
        if(error.length){
         return  res.status(400).json({error});
        }
        next();
}


module.exports = userValidator;