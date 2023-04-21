const mongoose=require('mongoose')
const userModel= new mongoose.Schema({
    fname: {type:String, required:true},
    lname: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true}, // encrypted password 
    profession:{type:String, required:true}
},{timestamps:true})

module.exports=mongoose.model('User',userModel)