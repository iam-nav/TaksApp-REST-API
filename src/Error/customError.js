const errorHandler = async(error)=>{
    console.log(error)
const Message = await error.message
console.log(Message)
    if(Message.match(/\password/)){
    return  JSON.stringify({messageValidation:"Password must be at least 7 characters"})    
    }else if(Message.match(/\E11000 duplicate key|email_1/))
    {
    return  JSON.stringify({messageValidation:"Email Address Already Exist"})
    }else if(Message.match(/\Email is not valid/)){
        return JSON.stringify({messageValidation:"Email Address Required"})
    }else{
        return JSON.stringify({messageValidation:"Enter Your Name"})
    }

    }


module.exports = errorHandler