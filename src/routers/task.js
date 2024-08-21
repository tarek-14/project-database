const express =require ("express")
const Task = require('../models/task')
const auth = require("../middleware/auth")
const router = express.Router()
const findByIdAndDelete = require("../models/user")

router.post("/tasks" , auth , async (req , res )=>{
    try {
        const task = new Task ({...req.body , owner : req.user._id})
        await task.save()
        console.log(task)
        res.status(200).send(task)
    }
    catch(error){
        res.status(400).send(e.message)
    }
})
///////////////////////////////////////
//  بعمل get لكل التاسكات الى عندى
router.get('/tasks' , auth , async (req, res )=>{
    try{
        const tasks = await Task.find({}) 
        res.status(200).send(tasks)
    }
    catch(error){
        res.status(400).send(e.message)
    }
})
///////////////////////////////////////////////
// // بعمل get بس عن طريق id 
router.get("/tasks/:id" , auth , async(req ,res)=>{
    try{
        // const task = await Task.findById(req.params.id)
        const id = req.params.id
        const task = await Task.findOne({_id:id , owner : req.user._id })
        if(!task){
            return res.status(404).send('التاسك ده مش بتاع البوز الى فاتح ')
        }
        res.send(task)
    }
    catch(error){
        res.status(400).send(e.message)
    }
})
// ////////////////////////////////////////////////////
router.patch("/tasks/:id" , auth , async(req ,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findByIdAndUpdate({_id},req.body , {
            new : true , 
            runValidators : true 
        })
        if(!task){
            return res.status(404).send('No task')
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(e.message)
    }
})
// /////////////////////////////////////////////////
router.delete("/tasks/:id",auth, async(req ,res) =>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(e.message)
    }
})
module.exports = router