const express = require('express');
const { signinRequire, isAuth } = require('../controller/auth');
const router = express.Router();

const {userById , read , update,postOrder,getOrder }  = require('../controller/user');

router.get('/profile/:userId',signinRequire,isAuth, (req , res)=>{
               res.json({
                   user : req.profile
               })          
})

router.get('/getuser/:userId',signinRequire, isAuth, read)
router.patch('/updateProfile/:userId' ,signinRequire, isAuth, update);

router.post('/order/:userId',signinRequire,isAuth, postOrder);
router.get('/order/:userId', signinRequire,isAuth, getOrder);
router.param('userId' , userById);
 

module.exports = router;