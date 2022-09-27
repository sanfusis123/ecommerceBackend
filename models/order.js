const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;


const cartItemSchema  = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: 'Product'
    },
    name:String,
    price: Number,
    qty: Number
 }, {
     timestamps: true
 }
)
 
const CartItem = mongoose.model('CartItem' , cartItemSchema)


const orderSchema = new mongoose.Schema({

  products : [cartItemSchema],
  TXN_Details: {},
  amount: Number ,
  status: {
      type: String,
      default: 'Not Processed',
      enum:['Not Processed' , 'Processing' , 'Shipped' , 'Delivered' , 'Cacelled']
    },
  address: String,
  updated: Date,
  user: {type: ObjectId , ref: 'User'}

},{
    timestamps: true
})

const Order = mongoose.model('Order' , orderSchema);

module.exports = {Order , CartItem}

 