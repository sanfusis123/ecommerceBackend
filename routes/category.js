const express = require('express');
const router = express.Router();


const {create , read , categoryById , list , updateCat , removeCat} = require('../controller/category');
const {signinRequire , isAuth, isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user');


router.get('/getcategory/:categoryId' , read );
router.post('/create/:userId',signinRequire,isAuth,isAdmin, create);
router.get('/allcat', list);
router.put('/updatecategory/:categoryId/:userId' , signinRequire , isAuth , isAdmin, updateCat);
router.delete('/delete/:categoryId/:userId' , signinRequire , isAuth , isAdmin , removeCat);

router.param('categoryId' , categoryById);
router.param('userId' , userById);



module.exports = router