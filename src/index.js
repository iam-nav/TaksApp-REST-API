const express = require('express')
const app = express()
const cors = require('cors')
require('./db/mongoose')
const CookieParser = require('cookie-parser')
const RouterUser = require('./routers/users')
const RouterTask = require('./routers/tasks')


const port = process.env.PORT

app.use(cors())

app.use(CookieParser())
app.use(express.json())  //to convert the data in json form


app.use(RouterUser)
app.use(RouterTask)


//handling error
app.listen(port,()=>{
    console.log(`connected${port}`)
})