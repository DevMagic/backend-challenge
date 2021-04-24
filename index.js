/*
__   ___  __        ___    __      __   ___                  __     __
|  \ |__  /__`  /\  |__  | /  \    |  \ |__  \  /  |\/|  /\  / _` | /  `
|__/ |___ .__/ /~~\ |    | \__/    |__/ |___  \/   |  | /~~\ \__> | \__,

*/
//Dependencias necessarias nesse ponto

const express = require('express');
const app = express();
const endPoints = require('./endPoints.js')


const port = 3000;

// endPoints.js
app.use('/api', endPoints);

app.get('/', (req, res) => {
  res.send('bem vindo!');
})


app.listen(port, () =>{
    console.log('app escutando no port: ', port);
})
