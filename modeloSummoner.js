const mongoose = require('mongoose');

const summonerSchema = new mongoose.Schema({
  Nickname: String,
  AccountId: String,
  SummonerLevel: Number,
  ProfileIconId: Number,
  SummonerId: String,
// esse nomex foi outra gambiarra que eu inventei. (se voce nao entendeu, por favor leia os comentarios do endPoints.js)
  nomex: {type: String, unique: true},
},{
  versionKey: false
}
);

const Summoner = mongoose.model('Summoner', summonerSchema);

module.exports = Summoner;
