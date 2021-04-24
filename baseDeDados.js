const mongoose = require('mongoose');
require('dotenv').config();
const uriMongo = `mongodb+srv://${process.env.USUARIO_MONGO_REMOTE}:${process.env.SENHA_MONGO_REMOTE}@cluster0.smwjf.mongodb.net/apiRiotGames?retryWrites=true&w=majority`


//nao tem nada muito emocionante por aqui, só esta conectando no mongoDB

mongoose.connect(uriMongo, {useNewUrlParser: true, useUnifiedTopology: true});

const conexaoMongoDb = mongoose.connection;

conexaoMongoDb.on('error', console.error.bind(console, 'connection error: '));
conexaoMongoDb.once('open', function() {
    console.log('base de dados conectada');
})
