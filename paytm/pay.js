const router = require('express').Router();
const https = require('https');
const qs = require('querystring');
const { signinRequire, isAuth } = require('../controller/auth');
const { userById } = require('../controller/user');
const { Order } = require('../models/order');
const port = process.env.PORT
const checksum_lib = require('./checksum');
const config = require('./config');

router.post('/payment/:userId' ,signinRequire , isAuth, (req, res)=>{
     if(!req.profile._id){
         return res.status(400).json({Error : 'NOt user is found'}) 

     }
     if(!req.body){
         return res.status(400).send({Error : 'there is no item is selected'})
     }

     const {amount, orderId  } = req.body
     const {_id , email} = req.profile;
     const time = new Date().getTime();
     let params = {};
     params['MID'] = config.mid;
     params['WEBSITE']= config.website;
     params['CHANNEL_ID'] = 'WEB';
     params['INDUSTRY_TYPE_ID'] = 'Retail';
     params['ORDER_ID']=  orderId;
     params['CUST_ID'] =`${ _id}`;
     params['TXN_AMOUNT'] = `${amount}`;
     params['CALLBACK_URL'] = `http://ecommerceme.herokuapp.com:${port}/paytm/kissme`
     params['EMAIL'] =   email;

    checksum_lib.genchecksum(params , config.key , (err, checksum)=>{
       if(err){
           return console.log(err);
       }


          // let txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
   


        let from_filed = Object.entries(params).map((par, i)=>(
           `<input type='hidden' name='${par[0]}' value='${par[1]}' />`
            ))
        from_filed += `<input type='hidden' name='CHECKSUMHASH' value=${checksum} />`
        res.status(200).json({htmlData : `<div>${from_filed}</div>`})
       

    })

})


router.post('/kissme',(req ,res)=>{
   let  body ='';
    req.on('data', (data)=>{
        body += data
    })
    req.on('end' ,()=>{
        let post_data = qs.parse(body);
        const  checksumhash = post_data.CHECKSUMHASH;
        const result = checksum_lib.verifychecksum(post_data ,config.key , checksumhash)
        if(!result){
           console.log('checksum is not varified');

        }else{
          const params = {'MID': config.mid , 'ORDERID': post_data.ORDERID};
          checksum_lib.genchecksum(params , config.key , (err , checksum)=>{
             if(err){
                 return console.log(err);
             }
              params.CHECKSUMHASH = checksum;
             post_data = `JsonData=${JSON.stringify(params)}`
               
            const options = {
              hostname: 'securegw-stage.paytm.in', // for staging
             // hostname: 'securegw.paytm.in', // for production
             port: 443,
             path: '/merchant-status/getTxnStatus',
             method: 'POST',
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Length': post_data.length
             }
              }
             // Set up the request
           var response = "";
           var post_req = https.request(options, function(post_res) {
             post_res.on('data', function (chunk) {
               response += chunk;
             });
    
             post_res.on('end', async function(){
               console.log('S2S Response: ', response, "\n");
    
               var _result = JSON.parse(response);
                 if(_result.STATUS == 'TXN_SUCCESS') {

                  console.log('payment success');

                  
                  const order = await  Order.findById(_result.ORDERID);
                  if(!order) return res.status(401).json({Error : 'Order is not found'});
                  order.TXN_Details = {
                      TXNID : _result.TXNID,
                      BANKTXNID: _result.BANKTXNID,
                      STATUS : _result.STATUS
                  };
                  await order.save();
                  
                  return res.status(200).json({Payment : 'SuccessFul' , order : " Updated"});
                 }else {
                      console.log('payment failed');
                      return res.status(400).json({Payment : 'Failed' , order : "Not ordered"});
                  
                 }
               });
           });

           post_req.write(post_data)
           post_req.end();
    
         
          });


        }

        


    })
    res.status(200).redirect(`http://ecommerceme1.herokuapp.com/account/cart`);

        

})


router.param('userId' , userById);


module.exports = router;
