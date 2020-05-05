const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')
const Task = require('../db/models/tasks')


router.post('/tasks', auth,async (req,res)=>{
    const task = new Task({
        ...req.body, //... spread opertor used
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch{
        res.status(400).send(e)
    }
})

router.get('/tasks',auth, async(req,res)=>{
   const completedQuery = req.query.completed
   const limit = parseInt(req.query.limit)
   const skip = parseInt(req.query.skip)
    try{
        if(completedQuery){
        const task = await Task.find({owner:req.user._id,completed:completedQuery}).limit(limit).skip(skip).sort({createdAt:-1})
       return res.status(200).send(task)
        }    
     const task = await Task.find({owner:req.user._id}).limit(limit).skip(skip).sort({createdAt:-1})
    // await task.populate('owner').execPopulate()
    res.status(200).send(task)
    }catch(e){
        res.status(500).send('Tasks Not found'+e)
    }
})


router.get('/tasks/:id',auth, async (req,res)=>{
const _id= req.params.id
    try{
   const task = await Task.findOne({_id,owner:req.user.id})
   res.status(200).send(task)
}catch (e){
    res.status(404).send('Task Not Found')
}
})

router.patch('/tasks/:id', auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isvalidOperation = updates.every((update)=>{
    return  allowedUpdates.includes(update)
})
if(isvalidOperation ===false){
 return res.status(404).send({error:'Invalid updates'})
}

const _id = req.params.id
try{
    const task = await Task.findOne({_id,owner:req.user.id})
    updates.forEach((update)=>task[update] = req.body[update])
    await task.save()
    //const taskUpdate = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).send(task)
}
catch (e){
    res.send({error:"Invalid Updates"})

}
})


router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
try{
    const Deleted_user = await Task.findOneAndDelete({_id,owner:req.user.id})
    res.status(200).send(Deleted_user)
}catch (e){
    res.status(404).send('Task Not Found')
}

})


module.exports = router