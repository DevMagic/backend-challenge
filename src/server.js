const express = require('express');
const rotas = require('./routes/routes');
const db = require('./config/db');
const tabela = require('./config/tabelas');
const app = express();

db.connect(erro => {
    if(erro) {
        throw new Error(erro)
    } else {
        tabela.iniciar(db)
        app.use(express.json());
        app.use(rotas);                         
        app.listen(5000);
    }
})
