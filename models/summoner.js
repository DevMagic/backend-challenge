const Mongoose = require("../database/mongodb")

const SummonerSchema = mongoose.Schema({
    id:{
        type: Number
    },
    nickname:{
        type: String,
        required: true,       
    },
    accountId:{
        type: Number,
        unique: true
    },
    summonerLevel:{
        type: Number
    },
    profileIconId:{
        type: Number
    },
    summonerId:{
        type: Number,
        unique: true
    },
    userId:{
        type: Number
    }
})

const Summoner = Mongoose.model("Summoner", SummonerSchema);
module.exports = Summoner
