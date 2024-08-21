
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose')
app.use(express.json()) 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
app.use(userRouter)
app.use(taskRouter)

// const bcryptjs = require("bcryptjs")
// const passwordFunction = async ()=>{
//     const password = "is1312i5"
//     const hashedPassword = await bcryptjs.hash(password , 8)
//     // console.log(password)
//     // console.log(hashedPassword)

//     const compare = await bcryptjs.compare("is1312i5" , hashedPassword)
//     // console.log(compare)
// }
// passwordFunction()

app.listen(port , ()=>{console.log("All Done successfully")})