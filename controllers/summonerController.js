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
            console.log(exist)
            return res.status(401).send({"error": "This summoner name already exists"})    
        }
       await Summoner.create({
            _id: uuid(),
            nickname: user.data.name,
            accountId: user.data.accountId,
            summonerLevel: user.data.summonerLevel,
            profileIconId: user.data.profileIconId,
            summonerId: user.data.id,
            userId: req.body._id
        })
        return res.status(200).send({"message": "Summoner created"})
    

    }catch(err){
        if(err.response.status === 404){
            return res.status(404).send({"error": "Summoner name not found in League of Legends database"})
        }
    
        return res.status(400).send({"error": "Error registering summoner"})
 
    }
}

exports.showAllSummoners = async (req, res)=>{
    try{
        const summoners = await Summoner.find({})
        console.log(summoners)
        res.status(200).send(summoners)
    }catch(err){
        console.log(err)
        return res.status(400).send({"error": "Error in database"})
    }
}