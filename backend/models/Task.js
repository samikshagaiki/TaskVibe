const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    priority:{type:String,enum:['low','medium','high'],default:'medium'},
    status:{type: String,enum:['todo','in-progress','done'],default:'todo'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    dueDate:{type:Date},
    order:{type:Number,default:0},
});

module.exports = mongoose.model('Task',taskSchema);