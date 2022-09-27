const validator  = require('validator');

const productValidator = (req, res , next)=>{
    const {name, description, price, category , quantity , shiping} = req.body;
    const error = [];
    const isEmptyChecker = (data , dataname)=>{
         
        if(validator.isEmpty(data)){
                error.push({Error : `${dataname} :This should not be empty `});
        }

    } 
    console.log(name);
    isEmptyChecker(name , 'name');
    isEmptyChecker(description, 'description');
    isEmptyChecker(price, 'price');
    isEmptyChecker(category , 'category');
    isEmptyChecker(quantity , 'quntity');
    isEmptyChecker(shiping , 'shiping'); 
    if(error.length){
       return  res.status(400).json(error)
    } 
     
    next();
}



module.exports = productValidator;