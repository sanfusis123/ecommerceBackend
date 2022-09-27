const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.ICLOUD_NAME,
    api_key: process.env.IAPI_KEY,
    api_secret: process.env.ISECRET_KEY,
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Ecom",
      public_id:(req,file)=> file.fieldname + '_'+ file.originalname

    },
  });

exports.upload = multer({ 
    limits:{
        fileSize:1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
              return cb(new Error('file is must be jpg or jpeg or png or gif'));
        }
               cb(undefined, true);
               
     },
    storage
    
}).array('ProductImage' , 6);
