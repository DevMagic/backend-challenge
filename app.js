const express = require('express');
const app = express();



require('dotenv').config({path:'./.env'})
app.use(express.json())
app.use(express.urlencoded({ extended: true}))




app.use('/',(req,res,next)=>{
    res.status(200).send({
        message: "Running Service"
    })
})



module.exports = app;