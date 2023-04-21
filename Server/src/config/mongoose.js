const mongoose=require('mongoose')

mongoose.connect("mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/Digital_Brain",{
    useNewUrlParser: true
} )
.then(()=>console.log('connected to mongodb'))
.catch((error)=>console.log(error))

module.exports=mongoose