const express = require('express');
const router = express.Router();
const {signinRequire , isAuth,  isAdmin} = require('../controller/auth');
const {createProduct , productById , productRead,
       removeProduct , updateProduct , products ,
       relatedProduct , categories , searchProduct,
       productPhoto, queryProduct } = require('../controller/product.js');
const {upload} = require('../controller/filehandler');
const {userById} = require('../controller/user');
const productValidator = require('../validator/product');
router.post('/create/:userId',signinRequire,isAuth ,isAdmin ,upload,productValidator, createProduct);
router.get('/getproduct/:productId' ,  productRead);
router.delete('/removeproduct/:productId/:userId' ,signinRequire ,isAuth,isAdmin,removeProduct);
router.patch('/updateproduct/:productId/:userId', signinRequire , isAuth , isAdmin , upload ,updateProduct);

router.get('/products', products);
router.get('/relatedProduct/:productId' , relatedProduct );
router.get('/categories' , categories);
router.post('/by/search' , searchProduct);
router.get('/query/product', queryProduct);
router.get('/photos/:productId' , productPhoto);

router.param('userId' , userById);
router.param('productId' , productById);


module.exports = router;