const {  Order } = require('../models/order');
const User = require('../models/users');

exports.userById = (req, res, next ,id)=>{
    
         User.findById(id).exec((err , user)=>{
             if(err || !user){
                 return res.status(400).json({
                     Error : 'No User is found'
                 })
              }
             user.salt = undefined;
              user.tokens = undefined;
             req.profile = user;
             next();
         })
}


exports.read = (req,  res)=>{
          const user = req.profile;
          req.profile.salt = undefined;
          req.profile.hashed_Password = undefined;
          
          res.status(200).json(req.profile);

}

exports.update = (req,res)=>{
         const updates = Object.keys(req.body);
         updates.forEach((update)=>{
             req.profile[update] = req.body[update];
         })
         req.profile.save((err , data)=>{
            if(err || !data){
                return res.status(400).json({error : 'Profile is not updated' , err});
            }
           return   res.status(200).json(req.profile);
        })
        // User.findOneAndUpdate({_id : req.profile.id} ,
        //                       {$set: req.body}, 
        //                       {new : true} ,
        //                       (err,user)=>{
        //                           if(err){
        //                               return res.status(400).json({massege : 'user is not found'})
        //                           }
        //                           return res.status(200).json(user);
        //                       })

    }

exports.postOrder = async(req,res)=>{
      req.body.user = req.profile._id;
     const order = new  Order(req.body);
     try{
       await order.save();
       return res.status(200).json({orderId : order._id , msg: 'Order is created'});

     }catch(e){
        console.log(e);
        return res.status(404).json({Error : 'Order is Not created'});
     }
     
}

exports.getOrder = async(req,res)=>{
    try{
        const id = req.profile._id;
        const orders = await Order.find({user : id});
        let or = []; 
        orders.forEach((o,i)=>{
             let toObejct = o.toObject();
             toObejct.product = toObejct.products[0]._id;
             delete toObejct.products;
             delete toObejct.TXN_Details;
             or.push(toObejct);
        })
        
      return res.status(200).json(or);


    }catch(e){
       return  res.status(404).json({Error : e});
    }
}

