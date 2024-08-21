const express = require ('express')
const User = require('../models/user')
const router = express.Router()
const jwt = require ('jsonwebtoken')
const auth = require('../middleware/auth')

router.post ('/users' , (req , res)=>{
    console.log(req.body)

    const user = new User (req.body)
    // console.log(user)
    user.save()
    .then((user) => {res.status(200).send(user)})
    .catch((error) => {res.status(400).send(error)})
})

// /////////--------------------
//get 
// بقرأ كل الداتا 
router.get("/users" , auth , (req,res)=>{
    User.find({})
    .then((users) => {res.status(200).send(users)})
    .catch((error) => {res.status(500).send(error)})
})
// بقرأ دكمنت واحد بس عن طريق id 
router.get("/users/:id" , auth , (req,res)=>{
    // بمسك  id الى بكتبه فىالسيرش 
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send('unable to find userrrrrrr')
        }
        res.status(200).send(user)
    })
    .catch((error) => {res.status(500).send(error)})
})

// //////////////////////
// // patch

router.patch("/users/:id" ,auth, async(req,res)=>{
    try{
        const _id = req.params.id
        const update = Object.keys(req.body)
        // const user = await User.findByIdAndUpdate( _id , req.body ,{
        //     new : true ,             // عشان يجيب التعديل بعد الاضافه
        //     runValidators : true        //  مع findByIdAndUpdate لازم عشان يشغل الشروط بتاعت Validator 
        // }) 
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('no user founded')
        }
        update.forEach((ele)=>(user[ele] = req.body[ele]))
        await user.save()
        res.status(200).send(user)
        }
        catch(error) {
            res.status(500).send(error)
        }
})

/////////////////////////////////////////////
// delete
router.delete("/users/:id" ,auth , async(req,res)=>{
    try{
        const _id = req.params.id

        const user = await User.findByIdAndDelete( _id )
        if(!user){
            return res.status(404).send('unuble to find user')
        }
        res.status(200).send(user)
        }
        catch(error) {
            res.status(500).send(error)
        }
})
// // login

router.post("/login" , async (req , res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateToken()

        res.status(200).send({ user ,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// ///////////////////////
//  add token
router.post ("/users" , async(req , res)=>{
    try {
        const user = new User (req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(400).send({user , token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
// /////////////////////////////////////////////
// profile
router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})
//------------------------------
router.delete("/logout" , auth , async(req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((ele)=>{
            return ele !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(error){
        res.status(500).send(error)
    }
})
///////////////////////////////////////////////////
//logoutAll
router.delete("/logoutAll" , auth , async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(error){
        res.status(500).send(error)
    }
})





module.exports = router