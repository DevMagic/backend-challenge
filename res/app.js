const express = require('express');
const app = express();
const mongoose = require("./database/mongodb")


require('dotenv').config({path:'./.env'})
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const userRouter = require("./routes/userRouter")
const summonerRouter = require("./routes/summonerRouter")


app.use('/user',userRouter);
app.use('/summoner',summonerRouter);


app.use((req,res,next) =>{
  res.status(404).send({"error": "Not Found"})
});


module.exports = app;