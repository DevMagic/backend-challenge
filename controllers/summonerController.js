const Summoner = require("../models/summoner");
const {v4:uuid} = require("uuid")
const axios = require('axios');


exports.cadSummoner = async(req,res)=>{
    try{
        const {summonerName} = req.body

        if(!summonerName){
            return res.status(400).send({"error": "Empty summoner name"})
        } 
        const user = await axios.get(encodeURI(`${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.LOL_KEY}`))
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

exports.showAllSummoners = async (req, res)=>{
    try{
        const summoners = await Summoner.find({})
        res.status(200).send(summoners)
    }catch(err){
        console.log(err)
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