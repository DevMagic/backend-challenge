const summonerData = require('../database/summonerData');
const axios = require('axios');

const request = async function(url, method, data){
    return await axios({url, method, data});
}

exports.getSummoners = async function (){
    return await summonerData.getSummoners();
};

exports.postSummoner = async function(summonerName, api_key){

    const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`;
    const response = await request(url , "get")
    const data = await response.data

    if(JSON.stringify(data) === '{"status":{"message":"Data not found - summoner not found","status_code":404}}'){
        await Promise.reject(new Error("Usuario não encontrado"));
    } else if (JSON.stringify(data) === '{"status":{"message":"Forbidden","status_code":403}}') {
        await Promise.reject(new Error("Api Key incorreta ou fora de validade"));
    } else {
        return await summonerData.postSummoners(data);
    };
};

exports.deleteSummoner = async function (summonerId){

    const summoner = await summonerData.getSummonerById(summonerId);

    if(summoner === null){
        await Promise.reject(new Error("Usuario não encontrado"));
    } else {
        return await summonerData.deleteSummoners(summonerId);
    }
};

exports.updateSummoner = async function(summonerAtt, summonerId, api_key){

    const summoner = await summonerData.getSummonerById(summonerId);
    if(summoner === null){
        await Promise.reject(new Error("Usuario não encontrado"));
    } else {
        const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner.nickname}?api_key=${api_key}`
        let res = await request(url,"get")
        let data = await res.data;
        
        const dataAtt = {
            "id": data.id,
            "accountId": data.accountId,
            "puuid": data.puuid,
            "name": summonerAtt.summonerName,
            "profileIconId": data.profileIconId,
            "revisionDate": data.revisionDate,
            "summonerLevel": summonerAtt.summonerLevel
        }

        await summonerData.updateSummoners(summonerAtt, summonerId)
        return dataAtt;
    }    
};

exports.getInfoSummoners = async function (api_key){

    const summonersArray = await summonerData.getSummoners();
    let infoSummoners = {};
    infoSummoners = [];
    let res = null;
    let data, data2; 

    await Promise.all(summonersArray.map(async (summoner) => {
        const url = `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.summonerid}?api_key=${api_key}`

        while (res == null){

            try{
                res = await request(url,"get");
            }catch(erro) {
                //A api da riot premite apenas 20 requisições por segundo, por isso espero 1 segundo antes de tentar uma nova requisição
                await sleep(process.env.SLEEP_TIME)
            }

        }
        
        if (JSON.stringify(data) === '{"status":{"message":"Forbidden","status_code":403}}') {
            await Promise.reject(new Error("Api Key incorreta ou fora de validade"));
        }

        data2 = await res.data;
        let vitorias = 0, derrotas = 0;

        await Promise.all(data2.map(async (summonerInfo) =>{
            vitorias += summonerInfo.wins;
            derrotas += summonerInfo.losses;
        }));

        let finalData = {
            ...summoner,
            wins: vitorias,
            losses: derrotas,
        }

        infoSummoners.push(finalData);
    }));

    return infoSummoners;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}