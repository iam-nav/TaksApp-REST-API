const express = require('express')
const router = new express.Router()
const User = require('../db/models/user') 
const auth = require('../middleware/auth')
const sharp = require('sharp')
const errorHandler = require('../Error/customError')
var multer  = require('multer')

var upload = multer({ 
limits:{
    fileSize:1000000
},
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png)$/)){ //rgx expressions
        return cb(new Error('Please enter a jpg or png file'))
    }
    cb(undefined,true)

} })



router.post('/profile/me', auth,upload.single('avatar'),async function (req, res, next) {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer() // to convert the images
    req.user.avatar = buffer
   await req.user.save()
    res.send()
  },(error,req,res,next)=>{ 
    res.status(400).send({error:error.message})
  })
  
router.delete('/profile/me', auth, function (req, res, next) {
   req.user.avatar = undefined
   req.user.save()
    res.send()
  },(error,req,res,next)=>{
    res.status(400).send({error:error.message})
  })

router.get('/profile/:id/me',async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        
        if(!user || !user.avatar){
        throw new Error()
        }
        res.set('Content-Type','images/jpg') //to render the image in jpg and png
        res.send(user.avatar)
    }
    catch(e){
        res.send('error'+e)
    }

})


//user insert
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
     await user.save()
     const token = await user.generateAuthToken()
    res.status(201).send({user,token})
    }catch (e){
    errorHandler(e).then((result)=>{
    res.status(400).send(result)
    })
  
    }
})

router.get('/users/me',auth,(req,res)=>{
    res.send(req.user)
})

router.post('/users/logout',auth,async(req,res)=>{
  try{
     req.user.tokens= req.user.tokens.filter(function(token){
        return token.token !== req.token
      })
      req.user.save()
     res.send()
  }
  catch (e){
      res.send("error"+e)
  }
})

router.post('/users/logout/all',auth,async(req,res)=>{
    try{
        req.user.tokens = []
       await req.user.save()
        res.send()
    }
    catch (e){
        res.send(e)
    }
})

router.get('/users',async (req,res)=>{
    try{
       const users = await User.find()
       res.send(users)
    }catch{
        res.status(500).send('User Not found')
    }      
})


router.patch('/users/update',auth,async (req,res)=>{    
const updates = Object.keys(req.body)
const allowedUpdates = ['name','age','email','password']
const isvalidOperation = updates.every((update)=>{
  return  allowedUpdates.includes(update)
})

if(!isvalidOperation){
 return res.status(404).send({error:'Invalid updates'})
}
try{

    const user = await User.findById(req.user._id)
    updates.forEach((update)=>user[update] = req.body[update])
    await user.save()
    //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
   if(!user){
    return res.status(404).send('User Not Found')
   }
    res.status(200).send(user)
}
catch (e){
    res.send('error'+e)
}
})  

router.delete('/users/remove', auth, async (req,res)=>{
try{
   await req.user.remove()
   res.send(req.user)
}
catch (e){
    res.status(404).send()
}
})


router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({token})
    }catch(e){
        res.status(404).send(e)

    }
})

module.exports = router
