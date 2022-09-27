const mongoose = require('mongoose');


const category = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:32,
        trim:true
    }

}, {timestamps: true});





module.exports = new mongoose.model('Category', category);