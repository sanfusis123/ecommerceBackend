const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types


const productSchema = new mongoose.Schema({

    name: {
        type:String,
        trim:true,
        maxlength:32,
        required:true
    },
    description:{
        type: String,
        maxlength:2000,
    },
    price:{
        type:Number,
        required:true,
        maxlength:32,
        trim:true
    },
    category:{
        type: ObjectId ,
        ref:'Category',
        required:true,
    },
    quantity:{
        type:Number
    },
    sold:{
        type: Number,
        default: 0
    },
     photos:{
         type: Array
     },
    shipping:{
        type:Boolean,
        required: false
    }

} , {timestamps: true});



module.exports = new mongoose.model('Product' , productSchema);








