const Summoner = require("../models/summoner");
const {v4:uuid} = require("uuid")
const axios = require('axios');
const exceljs = require("exceljs");
const { restart } = require("nodemon");

function isValid(a,b,res){
    if(isNaN(a) || isNaN(b)){
        return res.status(400).send({"error": "Invalid number"})
    }
    if(a>b){
        return res.status(400).send({"error": "Minimum invalid value"})
    }
    return true
}

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

        if(!summonerName){
            return res.status(400).send({"error": "Empty summoner name"})
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
        return res.status(200).send({"message": "Summoner created"})
    

    }catch(err){
        if(err.response.status === 404){
            return res.status(404).send({"error": "Summoner name not found in League of Legends database"})
        }
        if(err.response.status === 403){
            return res.status(403).send({"error": "Forbidden"})
        }
        return res.status(400).send({"error": "Error registering summoner"})
 
    }
}

exports.showAllSummonersDetailed = async (req, res)=>{
    try{
        let summoners
        const {nickname, summonerLevelMin, summonerLevelMax, 
            winsMin, winsMax , lossesMin, lossesMax} = req.params
           
        if(nickname == "@" && summonerLevelMin == "@" && summonerLevelMax == "@" && winsMin == "@" && winsMax == "@" && lossesMin == "@" && lossesMax== "@"){         
            summoners = await Summoner.find({})
            if(!summoners){
                return res.status(404).send({"error": "Not found summoners in database"})
            }
            const results = await Promise.all(requestSummonerIdApiLol(summoners))
            res.status(200).send(results)
        }
        else if(nickname !== "@" && summonerLevelMin == "@" && summonerLevelMax == "@" && winsMin == "@" && winsMax == "@" && lossesMin == "@" && lossesMax== "@"){
            summoners = await Summoner.find(({nickname: {$regex: nickname, $options: 'i'}}))
            if(!summoners){
                return res.status(404).send({"error": "Not found summoners in database"})
            }
            const results = await Promise.all(requestSummonerIdApiLol(summoners))
            res.status(200).send(results)
        }
        else if(nickname == "@" && summonerLevelMin !== "@" && summonerLevelMax !== "@" && winsMin == "@" && winsMax == "@" && lossesMin == "@" && lossesMax== "@"){
            if(isValid(summonerLevelMin,summonerLevelMax,res)===true){
                summoners = await Summoner.find({$and:[{summonerLevel: {$gte: summonerLevelMin}},{summonerLevel: {$lte: summonerLevelMax}}]})
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                res.status(200).send(results)
            }

        }
        else if(nickname == "@" && summonerLevelMin == "@" && summonerLevelMax == "@" && winsMin !== "@" && winsMax !== "@" && lossesMin == "@" && lossesMax== "@"){
            summoners = await Summoner.find({})
            if(isValid(winsMin,winsMax,res)===true){
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                const resultsFiltred = results.filter(curr =>(curr.losses >= winsMin && curr.losses <= winsMax))
                res.status(200).send(resultsFiltred)  
            }
         
        }

        else if(nickname == "@" && summonerLevelMin == "@" && summonerLevelMax == "@" && winsMin == "@" && winsMax == "@" && lossesMin !== "@" && lossesMax !== "@"){
            summoners = await Summoner.find({})
            if(isValid(lossesMin,lossesMax,res)===true){
                if(!summoners){
                    return res.status(404).send({"error": "Not found summoners in database"})
                }
                const results = await Promise.all(requestSummonerIdApiLol(summoners))
                const resultsFiltred = results.filter(curr =>(curr.losses >= lossesMin && curr.losses <= lossesMax))
                res.status(200).send(resultsFiltred)  
            }

     
        }
        else{
            return res.status(400).send({"error": "Error in params"})
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
        const {idSummoner} = req.body
        if(!idSummoner){
            return res.status(400).send({"error": "Empty summoner id"})
        }
        const user = await Summoner.findOneAndDelete({_id: idSummoner, userId: req.user._id})
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

        if(!_id || !summonerName || !summonerLevel){
            return res.status(400).send({"error":"Empty fieds"})
        }
        const user = await Summoner.findOneAndUpdate({_id: _id, userId: req.user._id},{nickname: summonerName, summonerLevel: summonerLevel})
            if(user){
                return res.status(200).send(user)
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