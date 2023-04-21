const mongoose = require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId

const taskSchema= new mongoose.Schema({
title:{type:String,required:true},
description :{type:String,required:true},
hasAlarm:{type:Boolean,default:true,required:true},
alarmDate:{type:Date,required:true},
dueDate:{type:Date,required:true},
status:{type:String,required:true,enum:["New","Pending", "Completed"]},
userId:{type:ObjectId,ref:"User",required:true},
isDeleted:{type:Boolean,default:false}
},{timestamps:true})

module.exports=mongoose.model("Task",taskSchema)