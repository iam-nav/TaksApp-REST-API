const jwt = require('jsonwebtoken')
const User = require('../db/models/user')
const auth =  async(req,res,next)=>{
  try{
    //req.setRequestHeader('Authorization','BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI1MWVlMmNkZmU3ZTM0ZmM0N2QzMTYiLCJpYXQiOjE1ODg5MjgyMjZ9.VMcPcQ0Iv2UMcRige-I4QQ-IxUVPQaSStI4PIisn8_M')
    const token = req.header('Authorization').replace('Bearer','')
    const decoded = jwt.verify(token,'thisismyfirstnodejsproject')
    const user = await User.findOne({_id:decoded._id,'tokens.token':token})
    
    if(!user){
        throw new Error()
    }
    req.token = token    
    req.user = user
    next()
  }catch (e){
      res.status(401).send({error:'please Authenticate'})
  }
}

module.exports = auth