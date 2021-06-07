require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')



app.use(express.json());
app.use('/', require('./route/summonerControler'));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000).close;