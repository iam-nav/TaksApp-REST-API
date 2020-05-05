const Mongoose = require('mongoose')
const TaskSchema = Mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:Mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }
},{timestamps:true})

const tasks = Mongoose.model('tasks',TaskSchema)


module.exports = tasks