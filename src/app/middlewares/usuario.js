const MainModels = require('../models/MainModels')

class Usuario {
    async JaCadastrado(req, res, next){
            const dados = await MainModels.JaCadastrado(req.body.summonerName)
            if(dados.rows != 0) return res.status(401).json({ erro: 'Usuario já cadastrado!'})
            
            next();
    }

    async JaDeletado(req, res, next) {
        const dados = await MainModels.pegaporId(req.params.id)

        if(dados.rows == 0) return res.status(401).json({ erro: 'Esse usuario não existe ou já foi deletado!'})

        next();
    }
}

module.exports = new Usuario();