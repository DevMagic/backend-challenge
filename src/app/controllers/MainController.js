const MainModels = require('../models/MainModels');
const axios = require('axios');
const API_KEY = ""; //Preencher com o seu token da riot api...

axios.defaults.baseURL = 'https://br1.api.riotgames.com/';
axios.defaults.headers['X-Riot-Token'] = API_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';


async function getSummoner(summonerName) {
    try {
        const response = await axios.get(`lol/summoner/v4/summoners/by-name/${summonerName}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

async function getDetalhes(summonerId) {
    try {
        const response = await axios.get(`/lol/league/v4/entries/by-summoner/${summonerId}`);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
class MainController{
    async cadastra(req, res) {
        try {
        const dados = await getSummoner(req.body.summonerName);

         await MainModels.cadastra(dados);

        return res.status(200).json();
        } catch (error) {
            if(error) return res.status(500).json({message: 'Problemas com o servidor, por favor tente novamente mais tarde.'});
        }
    }

    async SemDetalhe(req, res) {
        try {            
            const dados = await MainModels.pega(req.body.summonerName);

            if(dados.rows == 0) res.status(404).json({message: 'Tabela sem dados...'});

            res.status(200).json(dados.rows);
        } catch (error) {
            if(error) return res.status(500).json({message: 'Problemas com o servidor, por favor tente novamente mais tarde.'});
        }
    }

    async ComDetalhe(req, res) {
        try {
            
            let dados = await MainModels.pega();
            
           dados = dados.rows.map(async (dado) => {
                const dados = await getDetalhes(dado.summonerid);
                if(dados != 0) {
                    const vitorias = dados[0].wins + dados[1].wins
                    const derrotas = dados[0].losses + dados[1].losses
                    return {
                        ...dado,
                        wins: vitorias,
                        losses: derrotas
                    }
                }
            });
            
            const tudo = await Promise.all(dados);

            if(tudo == 0) res.status(404).json({message: 'Tabela sem dados...'});

            res.status(200).json(tudo);
        } catch (error) {
            if(error) return res.status(500).json({message: 'Problemas com o servidor, por favor tente novamente mais tarde.'});
        }
    }

    async edita(req, res) {
        try {
            await MainModels.edita(req.body.summonerName, req.body.summonerLevel, req.params.id);

            let dados = await MainModels.pegaporId(req.params.id);

            dados = dados.rows.map(dado => {
                return {
                    id: dado.id,
                    accountId: dado.accountid,
                    puuid: dado.puuid,
                    name: dado.nickname,
                    profileIconId: dado.profileiconid,
                    revisionDate: new Date(Date.now()).valueOf(),
                    summonerLevel: dado.summonerlevel
                }
            });

            res.status(200).json(dados);
        } catch (error) {
            if(error) return res.status(500).json({message: 'Problemas com o servidor, por favor tente novamente mais tarde.'});
        }
    }

    async Deleta(req, res) {
        try {
            await MainModels.deletaporId(req.params.id);

            res.status(200).json({message: "successfully deleted"});
        } catch (error) {
            if(error) return res.status(500).json({message: 'Problemas com o servidor, por favor tente novamente mais tarde.'});
        }
    }

    erro(req, res){
        res.status(404).json({message: "Route Not Found"});
    }
}

module.exports = new MainController();