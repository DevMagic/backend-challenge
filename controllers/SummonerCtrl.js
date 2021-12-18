const Summoner = require('../models/Summoner');
const fs = require("fs");
const exportSummonersToExcel = require('../services/export');
const axios = require('axios');

const { API_KEY, RIOT_URL } = process.env;

//  Criando todos summoners requisitados no desafio..
// Fiz um loop for para criar todos de uma vez
//  Quando fizer a requisição, use um espaço para separar os nicks e o loop funcionará,
//  por se tratar de vários items e a cada item uma busca na API da RIOT, o retorno da
//  mensagem exibindo os items cadastrados demorará cerca de 10 segundos,
// aguarde até que ela apareça e após isso cheque a tabela summoners no DB
exports.createSummoner = async (req, res) => {
    try {
        // Pegando o ID do usuário logado que está criando o summoner
        const userId = req.user.id;

        const { summonerName } = req.body;

        let summonersArray = summonerName;

        // Transformando os nicks digitados em um array de nicks
        summonersArray = summonersArray.split(" ");

        // Para cada nick do array, um summoner será criado, caso
        // algum summoner colocado no body não exista, o script parará e não criará
        // os summoners seguintes
        for (let summoner of summonersArray) {
            const summonerIdResponse = await axios
                .get(
                    `${RIOT_URL}/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`)
                .catch((err) => {
                    return res.status(err.response.status).json(err.response.data);
                });

            const {
                id, accountId,
                name, profileIconId, summonerLevel,
            } = summonerIdResponse.data;

            await Summoner.create({
                Nickname: name,
                AccountId: accountId,
                SummonerLevel: summonerLevel,
                ProfileIconId: profileIconId,
                SummonerId: id,
                userId
            })
        }

        const allSummoners = await Summoner.findAll({
            "attributes": ["id", "Nickname", "AccountId",
                "SummonerLevel", "ProfileIconId", "SummonerId"]
        });
        return res.status(200).json(allSummoners);

    } catch (err) {
        return res.status(400).json(err);
    }
};

// Listando todos os summoners cadastrados na tabela
exports.getSummoners = async (req, res) => {
    try {
        const summoners = await Summoner.findAll({
            "attributes": ["id", "Nickname", "AccountId",
                "SummonerLevel", "ProfileIconId", "SummonerId"]
        });
        return res.status(200).json(summoners);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// Listando um summoner específico de acordo com o ID
exports.getSummonersDetails = async (req, res) => {
    const idSum = req.params.id;

    const encryptedSummonerId = await Summoner.findByPk(idSum);

    if (encryptedSummonerId === null) {
        return res.status(400).json({ error: 'Nenhum summoner encontrado.' })
    }

    const { SummonerId } = encryptedSummonerId;

    const riotResponse = await axios
        .get(`${RIOT_URL}/lol/league/v4/entries/by-summoner/${SummonerId}?api_key=${API_KEY}`)
        .catch((err) => {
            return res.status(err.response.status).json(err.response.data);
        });

    const { data } = riotResponse;

    // Somatório das vitórias
    const totalWins = riotResponse.data[0].wins + riotResponse.data[1].wins;

    // Somatório das derrotas
    const totalLoses = riotResponse.data[0].losses + riotResponse.data[1].losses

    // Bônus: taxa de vitória
    const winrate = ((totalWins / (totalWins + totalLoses)) * 100).toFixed(1);

    return res.status(200).json({ data, totalWins, totalLoses, winrate });
};

// Atualizando summoner
exports.updateSummoner = async (req, res) => {
    const { Summonername, Summonerlevel } = req.body;

    const summoner = await Summoner.findOne({
        where: { id: req.params.id }
    })

    const updatedSummoner = await summoner.update(
        { Nickname: Summonername, SummonerLevel: Summonerlevel },
    )
    return res.status(200).json(updatedSummoner);
};

// Deletando summoner
exports.deleteSummoner = async (req, res) => {
    await Summoner.destroy({ where: { id: req.params.id } })

    return res.status(200).json({ message: "Summoner deletado com sucesso!" })
};

// Exportando a tabela de Summoners para um arquivo XLSX
exports.exportSum = async (req, res) => {
    try {
        const summoners = await Summoner.findAll();

        const workSheetColumnName = [
            "id",
            "Nickname",
            "AccountId",
            "SummonerLevel",
            "ProfileIconId",
            "SummonerId",
            "userId"
        ]

        const workSheetName = 'Summoners';

        let filePath = `./excelTable/summoners.xlsx`;
        // script para não repetir o nome do arquivo
        let newName = 0;

        if (fs.existsSync(filePath)) {
            newName = Math.round(Math.random() * 550 / 5) * 5 + 5;
            filePath = `./excelTable/summoners${newName}.xlsx`
        }

        exportSummonersToExcel(summoners, workSheetColumnName, workSheetName, filePath);

        return res.status(200).json({
            message:
                `Tabela exportada com sucesso, procure dentro da pasta excelTable!`
        })
    } catch (err) {
        return res.status(400).json(err);
    }
};




