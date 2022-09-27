const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path  = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const paymentRoutes = require('./paytm/pay');

const port = process.env.PORT;
const app = express();

const uploads = path.join(__dirname , './uploads/product')
console.log(uploads);
//database connection
const database = process.env.Database;

mongoose.connect(database ,
     {useNewUrlParser: true , 
      useCreateIndex: true,
      useUnifiedTopology: true})
      .then(()=> console.log('Database is connected'));



//middleware 

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(uploads));
app.use(cors());



// Routes 

app.use('/user' , authRoutes);
app.use('/user', userRoutes);
app.use('/category',categoryRoutes);
app.use('/product', productRoutes);
app.use('/paytm' , paymentRoutes);

app.listen(port , ()=>{
    console.log('app is runing on the server 2000');
});

