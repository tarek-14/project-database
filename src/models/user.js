const mongoose = require ('mongoose')
const validator = require('validator')
const { type } = require('os')
const bcryptjs = require("bcryptjs")
const jwt = require ('jsonwebtoken')
const userSchema = new mongoose.Schema( {
    username : {
        type : String,
        trim : true,
        required : true 
    },
    password :{
        type : String,
        trim : true,
        required : true ,
        minlength :8,
        validate(val){
            const password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(val)){
                throw new Error ("error password")
            }
        }
    },
    email : {
        type : String,
        trim : true,
        required : true ,
        lowercase : true , 
        unique : true,
        validate(val) {
            if(!validator.isEmail(val)){
                throw new Error ("Email is invaled")
            }
        }
    },
    age : {
        type : Number,
        default: 18,
        validate(val) {
            if( val <= 0){
                throw new Error ("age must be positive number ")
            }
        }
    },
    city :{
        type : String,
    },
    tokens : [
        {
            type : String,
            required : true ,
        }
    ]
})
userSchema.pre('save', async function () {
    const user = this        // document
    console.log(user)

    if(user.isModified("password")){
    user.password = await bcryptjs.hash (user.password , 8)}
    
        // await user.save()
})
// // login
userSchema.statics.findByCredentials = async (ema , pass )=>{
    const user = await User.findOne({email:ema})
    if(!user){
        throw new Error ("unable to login")
    }
    const isMatch = await bcryptjs.compare(pass,user.password)
    if(!isMatch){
        throw new Error ("unable to login")   
    }
    return user
}
userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()} , "tarek")
    user.tokens = user.tokens.concat(token)  //>>> concat  بضيف التوكن القديم على الجديد كل ماجى اعمل لوجن  بيكريت توكن
    await user.save()
    return token
}
// /////////////////////////
// hide private data
userSchema.methods.toJSON = function (){
    const user = this
    // convert document to object بحول الديكمنت لابجكت 
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens

    return userObj

}



const User = mongoose.model('User' ,userSchema)

module.exports = User