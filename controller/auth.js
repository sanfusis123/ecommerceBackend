const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/users');
const dberrors = require('../helpers/dberrors');



exports.signup = (req , res )=>{
       console.log(req.body);
       const user = new User(req.body);
       user.save((error  , user )=>{
           if(error) {
               if(dberrors(error).includes("11000" && 'email' && 'already exists')){
                   return res.status(400).json({error : [{Email : 'already Exist'}]});
               }
               return res.status(400).json({error : dberrors(error)});
           }

          // jwt token 
           const token =  user.genrateAuthToken();

           const {name ,  email , role, _id } = user
           return res.status(201).json({token ,user :{name  , email , role , _id}});
       })
          

}


exports.signin = (req , res)=>{
       const {email  ,  password} = req.body;
         User.findOne( {email} , (err , user)=>{

           if(err || !user){
               return res.status(401).send({Error : 'Email is not found , Please Sign Up'});
           }
           // authenticate user by password
           if(!user.authenticate(password)){
               return res.status(401).send({Error : 'Credential is not valid'});
           }

           // jwt token 
            const token =  user.genrateAuthToken();

            //Persist the token as t with expiry date 
                 
            res.cookie('t' , token , {expire : new Date() + 9999});

           // response in the json 
           const {name  ,  email ,  role , _id} = user;

            return  res.status(200).json({token , user: {name , email , role , _id}});

       })
}


exports.signout = (req , res)=>{
        
         res.clearCookie('t');
         res.status(200).send({massage : 'You are signout'});  
}



exports.signinRequire = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
})

exports.isAuth = (req , res , next)=>{
    const user = req.profile && req.auth && req.profile._id == req.auth._id;
     if(!user){
        return res.status(403).json({
             Error : 'Access Denied'
         })
     }
     next();
}

exports.isAdmin = (req, res , next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            Error : 'Access Denied'
        })
    }
    next();
}












