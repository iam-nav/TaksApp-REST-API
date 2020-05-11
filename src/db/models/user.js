var mongoose = require('mongoose');
var validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const FencyError = require('../../Error/customError')
const Task = require('./tasks')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        minlength:[3,'Enter Your name'],
    },
    age:{
        type:Number,
        validate(number){
            if(number<0){
                throw new Error('Age Must be a positive number')
            }
        }
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
        require:true,
        minlength:[7,'password must be at least 7 characters.'],
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
            throw new Error('Username must be at least 7 character')
        }
    }
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer
    }
    },
    {
        timestamps:true
    })
    //relationship with other document
    userSchema.virtual('tasks',{
        ref:'tasks',
        localField:'_id',
        foreignField:'owner'
    })


    //below method didnt send the object which we want to hide

    userSchema.methods.toJSON = function(){
        const user = this
        const UserObject = user.toObject()    //mongoose method
       
        delete UserObject.password
        delete UserObject.avatar

        return UserObject
    }

    //tokens in a method instance
    userSchema.methods.generateAuthToken = async function(){
        const token = jwt.sign({_id:this._id.toString()},'thisismyfirstnodejsproject')
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token
    }

    //login statics schema  for auth users
    userSchema.statics.findByCredentials = async (email,password)=>{
        const user =  await User.findOne({email:email})
        if(!user){
        throw new Error('unable to login')
        }
       const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
          return console.log('unable to connect password')
        }
        return user   
    }

    //middleware for hashing the password
    userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('Users',userSchema)


module.exports = User