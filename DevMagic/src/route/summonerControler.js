const express = require('express');
const controler = express.Router();
const summonerService = require('../service/summonerService');
controler.use(express.json());

const api_key = process.env.API_KEY;


controler.post('/criar', async function(req, res){
    try{
        const reqbody = req.body;
        const summonerSalvo = await summonerService.postSummoner(reqbody.summonerName, api_key);
        res.status(200).json(summonerSalvo)
    }catch(erro){
        res.status(500).send(erro.message)
    }
    
});

controler.get('/listarSummoners', async function(req, res){
    const summoners = await summonerService.getSummoners();
    res.status(200).json(summoners)
});

controler.get('/infoSummoners', async function(req, res){
    const infoSummoner = await summonerService.getInfoSummoners(api_key);
    res.status(200).json(infoSummoner);
});

controler.put('/atualizarSummoner/:id', async function(req, res){
    try{
        const summonerAtt = req.body;
        const dataAtt = await summonerService.updateSummoner(summonerAtt, req.params.id, api_key);
        res.json(dataAtt);
    }catch(erro){
        res.status(500).send(erro.message);
    }
    
});

controler.delete('/deletarSummoner/:id', async function(req, res){
    try{
        await summonerService.deleteSummoner(req.params.id)
        res.status(200).json({
            "message": "successfully deleted"
        });
    }catch(erro){
        res.status(500).send(erro.message)
    }
});



module.exports = controler