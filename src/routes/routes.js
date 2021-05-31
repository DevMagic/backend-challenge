const express = require('express');
const middleware = require('../app/middlewares/usuario');
const rotas = express.Router();

const MainController = require('../app/controllers/MainController')

rotas.post('/', middleware.JaCadastrado, MainController.cadastra)
     .get('/semdetalhes', MainController.SemDetalhe)
     .get('/comdetalhes', MainController.ComDetalhe)
     .put('/edita/:id', MainController.edita)
     .delete('/deleta/:id', middleware.JaDeletado, MainController.Deleta)

rotas.post('/*', MainController.erro)
     .put('/*', MainController.erro)
     .get('/*', MainController.erro)
     .delete('/*', MainController.erro)
     

module.exports = rotas;