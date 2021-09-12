const mongoose = require("../database/mongodb")

const SummonerSchema = mongoose.Schema({
    _id:{
        type: String
    },
    nickname:{
        type: String,
        required: true,       
    },
    accountId:{
        type: String,
        unique: true
    },
    summonerLevel:{
        type: Number
    },
    profileIconId:{
        type: Number
    },
    summonerId:{
        type: String,
        unique: true
    },
    userId:{
        type: String
    }
},{ versionKey: false })

const Summoner = mongoose.model("Summoner", SummonerSchema);
module.exports = Summoner
