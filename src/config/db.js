const { Pool } = require('pg');
//Preencher com os dados do seu banco de dados postgres
module.exports =  new Pool({
    user: '',
    password:'',
    host: '',
    port: '',
    database: ''
})