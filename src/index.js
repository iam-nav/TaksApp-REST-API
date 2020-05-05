const express = require('express')
const app = express()
require('./db/mongoose')
var multer  = require('multer')
const path = require('path');
const RouterUser = require('./routers/users')
const RouterTask = require('./routers/tasks')


const port = process.env.PORT

// app.use(express.json())  //to convert the data in json form
app.use(RouterUser)
app.use(RouterTask)


app.listen(port,()=>{
    console.log("connected "+port)
})