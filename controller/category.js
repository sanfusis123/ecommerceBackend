const Category = require('../models/category');
const errorHandlers = require('../helpers/dberrors');

exports.create = (req, res)=>{

       const category = new Category(req.body);

       category.save((err , data)=>{
           if(err){
               return res.status(400).json({
                   Error : errorHandlers(err)
               })
           }
           return res.status(201).json(data);

       })
}

exports.categoryById = (req ,res ,next , id)=>{
       Category.findById(id).exec((err , cat)=>{
            if(err || !cat){
                return res.status(400).json({massage : 'Category is not find'});
            }
             req.category = cat;
             next();
       })

      
}

exports.read = (req ,res )=>{
    res.status(200).json(req.category);
}

exports.list = (req, res)=>{
     Category.find().exec((err , list)=>{
         if(err || !list){
            return res.status(400).json({massege : 'There is not any category'});
         }
         return   res.status(200).json(list);
     });
  
    
}

exports.updateCat  = (req, res)=>{
      req.category.name = req.body.name;
      
      req.category.save((err , data)=>{
          if(err || !data){
              return res.status(400).json({  error : 'Category is updated'})
          }
           return res.status(200).json(data);
      })
}

exports.removeCat = (req ,res)=>{
      const cat = req.category;
      cat.remove();
      return res.status(200).json({massage : 'Category is delted'});
      
}
