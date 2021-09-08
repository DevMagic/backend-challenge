const express = require('express');
const app = express();
const mongoose = require("./database/mongodb")
const axios = require('axios');
const morgan = require('morgan');
require('dotenv').config({path:'./.env'})
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const userRouter = require("./routes/userRouter")
const summonerRouter = require("./routes/summonerRouter")

axios.get(`${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/KnifeTheSkull?api_key=${process.env.LOL_KEY}`)
  .then(function (response) {
 
  })
  .catch(function (error) {
   
  })
  .then(function () {
  });


app.use('/user',userRouter);

app.use(morgan('dev'));
app.use((req,res,next) =>{
  res.status(404).send({"error": "Not Found"})
});


module.exports = app;