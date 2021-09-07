const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');

require('dotenv').config({path:'./.env'})
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

axios.get(`${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/KnifeTheSkull?api_key=${process.env.LOL_KEY}`)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });


app.use('/',(req,res,next)=>{
    res.status(200).send({
        message: "Running Service"
    })
})



module.exports = app;