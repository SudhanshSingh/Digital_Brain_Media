const express=require('express')
const bodyparser=require('body-parser')
const route=require('./routes/route.js')

const db=require("./config/mongoose")
const app=express();

app.use(bodyparser.json())
app.use(express.static('build'))
app.use('/',route)

app.listen(process.env.PORT || 3000,()=>
console.log(`server is running on port ${process.env.PORT || 3000}`)  
)