const Product = require('../models/product');
const {upload} = require('../controller/filehandler');
const multer = require('multer');
const path = require('path')

const fs = require('fs')
const stream = require('stream')


exports.createProduct = (req, res)=>{
    const  product = req.body;
    const   imageArray  = [];
        req.files.forEach(file=>{
        imageArray.push({
            imageUrl: file.path,
            imagename: file.filename
        })

                })
    product.photos = imageArray
    upload(req,res ,(err)=>{
        if(err instanceof multer){
            return res.status(400).send('photo is not uploaded');
        }else if(err){
            return res.status(400).send(err);
        
        }
    })
       
     Product(product).save((err, product)=>{
                  if(err){
                      return res.status(400).json({err});
                  }
                  
                  return res.status(200).json({product});
     })
     
     

}


exports.productById = (req, res,  next , id)=>{
              
       Product.findById(id).populate('category')
       .exec((err , product)=>{
           if(err || !product){
              return res.status(400).json( {Error :'Product is not find'});
           }
           req.product = product;
           next();
       })
}
exports.productRead = (req , res)=>{
     res.status(200).json(req.product);
}

exports.removeProduct = (req , res)=>{
       const product  = req.product ;
       product.remove((err , rmProduct)=>{
           if(err || !rmProduct){
           return    res.status(400).json({massge : 'Product is not removed'});
           }
           res.status(200).json({massge : 'Product is removed'});
       })

}

exports.updateProduct = (req , res)=>{
      const updates = Object.keys(req.body);
      updates.forEach((update)=>{
           req.product[update] = req.body[update]
           }
           );

     const  updatedimageArray  = [];
     req.files.forEach(file=>{
     updatedimageArray.push({
         imageUrl: file.path,
         imagename: file.filename
     })

             })
 
  if(updatedimageArray){
    req.product.photos = updatedimageArray
  
    }            
  upload(req,res ,(err)=>{
      if(err instanceof multer){
          return res.status(400).send('photo is not uploaded');
      }else if(err){
          return res.status(400).send(err);
      
      }
  })


  req.product.save();
  res.send(req.product);
  
}

exports.products = (req , res)=>{
      let order = req.query.order ? req.query.order : 'asc';
      let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
      let limit = req.query.limit ? parseInt(req.query.limit) : 9;

          
      Product.find()
      .populate('category')
      .sort([[sortBy , order]])
      .limit(limit)
      .exec((err , products)=>{
        if(err){
        return     res.status(400).json({error : 'There is not product'})
        }
       return  res.status(200).json(products);
    })

}

exports.relatedProduct = (req , res)=>{
      let limit = req.query.limit ? parseInt(req.query.limit) : 9;

      Product.find({ _id : {$ne : req.product} , category : req.product.category})
             .limit(limit)
             .populate('category' , '_id name')
             .exec((err , products)=>{
                 if(err || !products){
                 return res.status(400).json({error : 'Not any product is found'});
                 }
                 return res.status(200).json(products)
             })
       
}

exports.categories = (req , res)=>{
        Product.distinct('category' , {} , (err,categories)=>{
            if(err || !categories){
                return res.status(400).json({error : 'Not any product is found'});
            }

            return res.status(200).json(categories);
        })
}


exports.searchProduct = (req,  res)=>{
      let order = req.body.order ? req.body.order : 'asc';
       let sortBy = req.body.sortBy ? req.body.sortBy :' _id';
       let limit = req.body.limit ? parseInt(req.body.limit)  : 9;
       let skip  = parseInt(req.body.skip);
       let findArgs = {};
       
       for(let key in req.body.filter){
           if(req.body.filter[key].length >0){
               if(key === 'price'){
                   findArgs[key] = {
                       $gte : req.body.filter[key][0],
                       $lte : req.body.filter[key][1]
                   }
               }
               else{
                   findArgs[key] = req.body.filter[key]
               }
           }
       }

       Product.find(findArgs)
              .sort([[sortBy , order]])
              .limit(limit)
              .skip(skip)
              .exec((err , products)=>{
                  if(err || !products){
                      res.status(400).json({
                          error : 'NO product found'
                      })
                  }
                  res.status(200).json(products);
              })

}

exports.productPhoto = (req,  res)=>{
        const img = req.product.photos[0].imageUrl;
        // if(img.length === 0){
        //     return res.status(400).json({Error : 'NO image found'})
        // }
        // const filesys = path.join(__dirname, `../uploads/product/${img[0].imagename}`)
        // //  res.set('Content-Type' , 'image/jpg');
        // //  return res.sendFile(filesys);

        //     const r = fs.createReadStream(filesys) // or any other way to get a readable stream
        //     const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
        //     stream.pipeline(
        //     r,
        //     ps, // <---- this makes a trick with stream error handling
        //     (err) => {
        //         if (err) {
        //         console.log(err) // No such file or any other kind of error
        //         return res.sendStatus(400); 
        //         }
        //     })
        //   return   ps.pipe(res) // <---- this makes a trick with stream error handling
       return  res.status(200).send(img)


}


exports.queryProduct = (req ,res)=>{
         const query = {};
         if(req.query.search){
             query.name = {$regex: req.query.search , $options: 'i'}
         }
        Product.find(query , (err, product)=>{
              if(err){
                return res.status(400).json({Error : err});
              }
              return res.status(200).json(product);
         }).select('-photos')

}

