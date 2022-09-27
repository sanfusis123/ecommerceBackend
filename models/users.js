const mongoose = require('mongoose');
const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const  userSchemaModel = {
         name: { 
             type: String, 
             trim: true,
             maxlenght: 32,
             required: true
         },
        email :{
            type: String,
            trim:true,
            required:true,
            unique: true
        },
        hashed_Password:{
            type:String,
            required:true
        },
        about:{
            type:String,
            trim: true
        },
        salt:{
            type: String
        },
        role:{
            type: Number,
            default: 0
        },
        history:{
            type: Array,
            default: []
        },
        tokens: [{
          token:{
            type: String,
            default:[]

          }
        }],
        username:{
            type:String
        },
        country:{
            type:String,
            default: 'India'
        },
        address:{
            type : String
        },
        mob:{
            type:Number
        }

}
const userSchema = new mongoose.Schema(
                    userSchemaModel ,
                     {timestamps : true });

//schema Vartual fields

userSchema.virtual('password')
.set(function(password){
      this._password = password;
      this.salt = uuid.v1();
      this.hashed_Password = this.encyptPassword(password);
})
.get(function(){
    return this._password;
});

userSchema.methods = {
      encyptPassword:function(password) {
               if(!password) return ''; 
               try{
                   return crypto.createHmac('sha256', this.salt)
                                .update(password)
                                .digest('hex');
               } catch (err){
                   return err;
               }
      },

      authenticate: function(plainText){
                    return   this.encyptPassword(plainText) === this.hashed_Password;
                } ,

      genrateAuthToken: function(){
                  const user = this;

                  const token = jwt.sign({_id :user._id} , process.env.JWT_SECRET);

                  user.tokens = user.tokens.concat({token});
                  user.save();
                  return token;
                 
      }          
}

module.exports = mongoose.model("User" , userSchema);                     