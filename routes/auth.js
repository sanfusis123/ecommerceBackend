const express = require("express");
const router = express.Router();
const { signup , signin , signout  , signinRequire}  = require('../controller/auth');
const userValidator = require('../validator/users');

 
// Routes 

router.post('/signup' ,userValidator , signup);

router.post('/signin' , signin);

router.get('/signout' , signout);

router.get('/hello',signinRequire,  (req, res)=>{
     res.send('gand faad dumga');
})

module.exports = router;