const Summoner = require("../models/summoner");
const {v4:uuid} = require("uuid")
const axios = require('axios');
const exceljs = require("exceljs");
const handlingErrors = require("../handling/handling")


function requestSummonerIdApiLol(summoners){
    let values = summoners.map(async (summoner) => {
        const result = await axios.get(encodeURI(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.summonerId}?api_key=${process.env.LOL_KEY}`));       
        let wins = 0
        let losses = 0
        result.data.map((curr)=>{           
            wins = wins + curr.wins
            losses = losses + curr.losses
        })
 
       return Object.assign({},summoner._doc,{"wins":wins,"losses":losses});
    })
    return values
}

exports.cadSummoner = async(req,res)=>{
    try{
        const {summonerName} = req.body
        const erros = await handlingErrors.handling(req.body,[16],[3])
        if(erros.length){
            return res.status(400).send({error: erros.join("; ")})
        }
        const user = await axios.get(encodeURI(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.LOL_KEY}`))
        const idSummoner = user.data.id
        const exist = await Summoner.findOne({"summonerId":idSummoner})
        if(exist){
        
            return res.status(401).send({"error": "This summoner name already exists"})    
        }
        
       await Summoner.create({
            _id: uuid(),
            nickname: user.data.name,
            accountId: user.data.accountId,
            summonerLevel: user.data.summonerLevel,
            profileIconId: user.data.profileIconId,
            summonerId: user.data.id,
            userId: req.user._id
        })
        return res.status(201).send({"message": "Summoner created"})
    

    }catch(err){
        if(err.response.status === 404){
            return res.status(404).send({"error": "Summoner name not found in League of Legends database"})
        }
        if(err.response.status === 403){
            return res.status(403).send({"error": "Forbidden League of Legends Token"})
        }
        return res.status(400).send({"error": "Error registering summoner"})
 
    }
}

exports.showAllSummonersDetailed = async (req, res)=>{
    try{
        let summoners
        const {nickname, summonerLevelMin, summonerLevelMax, 
            winsMin, winsMax , lossesMin, lossesMax} = req.params
            const erros = await handlingErrors.handling(req.params,[16,4,4,4,4,4,4],[3,1,1,1,1,1,1])
            if(erros.length){
                return res.status(400).send({error: erros.join("; ")})
            }
        const checkParams = Object.keys(req.params).filter((key)=>{
            if(req.params[key] !== "@"){
                return key
            }
           
        })  
              
        if(checkParams.length === 0){         
           
            summoners = await Summoner.find({})
            if(!summoners){
                return res.status(404).send({"error": "Not found summoners in database"})
            }
            const results = await Promise.all(requestSummonerIdApiLol(summoners))
            res.status(201).send(results)
        }

        else if(checkParams.length === 1 && checkParams.includes("nickname")){
            summoners = await Summoner.find(({nickname: {$regex: nickname, $options: 'i'}}))
            if(!summoners){
                return res.status(404).send({"error": "Not found summoners in database"})
            }
            const results = await Promise.all(requestSummonerIdApiLol(summoners))
            res.status(201).send(results)
        }

        else if(checkParams.length === 2 && checkParams.includes("summonerLevelMin") && checkParams.includes("summonerLevelMax")){
            const validedNumbers = handlingErrors.isValid(summonerLevelMin,summonerLevelMax)
            if(validedNumbers===true){
                summoners = await Summoner.find({$and:[{summonerLevel: {$gte: summonerLevelMin}},{summonerLevel: {$lte: summonerLevelMax}}]})
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                res.status(201).send(results)
            }
            return res.status(400).send({error: validedNumbers})

        }
        else if(checkParams.length === 2 && checkParams.includes("winsMin") && checkParams.includes("winsMax")){
            const validedNumbers = handlingErrors.isValid(summonerLevelMin,summonerLevelMax)
            if(validedNumbers===true){
            summoners = await Summoner.find({})
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                const resultsFiltred = results.filter(curr =>(curr.wins >= winsMin && curr.wins <= winsMax))
                res.status(201).send(resultsFiltred)  
            }
            return res.status(400).send({error: validedNumbers})
        }

        else if(checkParams.length === 2 && checkParams.includes("lossesMin") && checkParams.includes("lossesMax")){
            const validedNumbers = handlingErrors.isValid(summonerLevelMin,summonerLevelMax)
            if(validedNumbers===true){
            summoners = await Summoner.find({})
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                const resultsFiltred = results.filter(curr =>(curr.losses >= lossesMin && curr.losses <= lossesMax))
                res.status(200).send(resultsFiltred)  
            }
            return res.status(400).send({error: validedNumbers})
        }
        else{
            return res.status(400).send({"error": "Error when setting the parameters"})
        }
    
    }catch(err){

        return res.status(400).send(err)
    }
}

exports.showAllSummoners = async (req, res)=>{
    try{
        const summoners = await Summoner.find({})
        res.status(200).send(summoners)
    }catch(err){
        
        return res.status(400).send({"error": "Error in database"})
    }
}

exports.deleteSummoner = async (req, res)=>{
    try{
        const {_id} = req.body
        const erros = await handlingErrors.handling(req.body,[36],[35])
        if(erros.length){
            return res.status(400).send({error: erros.join("; ")})
        }
        const user = await Summoner.findOneAndDelete({_id: _id, userId: req.user._id})
        if(!user){
            return res.status(404).send({"error": "Summoner not found"})
        }
        res.status(200).send({"message": "Successfully deleted"})
    }catch(err){

        return res.status(400).send({"error": "Error in database"})
    }
}

exports.updateSummoner = async(req,res)=>{
    try{
        
        const {_id,summonerName,summonerLevel} = req.body

        const erros = await handlingErrors.handling(req.body,[36,16,4],[35,3,1])
        if(erros.length){
            return res.status(400).send({error: erros.join("; ")})
        }
        const user = await Summoner.findOneAndUpdate({_id: _id, userId: req.user._id},{nickname: summonerName, summonerLevel: summonerLevel})
            if(user){
                const alteredUser = await Summoner.findOne({_id:_id})
                return res.status(200).send(alteredUser)
            }
            return res.status(404).send({"error": "Summoner not found"})
     
    }catch(err){

        return res.status(400).send({"error": "Error in database"})
    }
}

exports.generateXlsx = async(req,res)=>{
    try{

        const summoners = await Summoner.find({})

        if(!summoners){
            return res.status(404).send({"error": "Not found summoners in database"})
        }
      
        const results = await Promise.all(summoners.map(async (summoner) => {
            const result = await axios.get(encodeURI(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.summonerId}?api_key=${process.env.LOL_KEY}`));       
            let wins = 0
            let losses = 0
            result.data.map((curr)=>{           
                wins = wins + curr.wins
                losses = losses + curr.losses
            })

     
     
           return Object.assign({},summoner._doc,{"wins":wins,"losses":losses});
        }))

        const workbook = new exceljs.Workbook()
        const sheet = workbook.addWorksheet("Summoners")
        sheet.columns = [
            {header: 'Id', key: 'id', width: 35},
            {header: 'NickName', key: 'nickname', width: 35}, 
            {header: 'AccountId', key: 'accountid', width: 35},
            {header: 'SummonerLevel', key: 'summonerlevel', width: 10},
            {header: 'ProfileIconId', key: 'profileiconid', width: 10},
            {header: 'SummonerId', key: 'summonerid', width: 35},
            {header: 'UserId', key: 'userid', width: 35},
            {header: 'Wins', key: 'wins', width: 10},
            {header: 'Losses', key: 'losses', width: 10},   
           ];
        results.map((curr)=>{
            const data = {id: curr._id,nickname: curr.nickname, accountid: curr.accountId,
                summonerlevel:curr.summonerLevel, profileiconid:curr.profileIconId,summonerid:curr.summonerId,
                userid:curr.userId,wins:curr.wins,losses:curr.losses}

            sheet.addRow(data)
        })
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{ argb:'cccccc' }
            }
        await sheet.workbook.xlsx.writeFile("./res/uploads/Summoners.xlsx")
         res.download("./res/uploads/Summoners.xlsx",(err)=>{
            if (err) {
                console.log(err)
              } else {
                console.log("Download Complete")
              }
        })
       
    }catch(err){
        if(err.response.status === 404){
            return res.status(404).send({"error": "Summoner name not found in League of Legends database"})
        }
        if(err.response.status === 403){
            return res.status(403).send({"error": "Forbidden"})
        }
        res.status(400).send(err)
    }
}