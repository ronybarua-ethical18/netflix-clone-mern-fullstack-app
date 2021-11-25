const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const movieRouter = require('./routes/movie')
const listRouter = require('./routes/list')

const app = express()
dotenv.config()


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB Connection successful')).catch((err) => console.log(err))

app.use(express.json())

//route lists
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/movies', movieRouter)
app.use('/api/lists', listRouter)

//starting the server
app.listen(8000, () =>{
    console.log("Backend server is running");
})