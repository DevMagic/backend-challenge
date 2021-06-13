import mongoose from 'mongoose';

const SummonerSchema = new mongoose.Schema({
  _id: String,
  nickname: {
    type: String,
    required: true,
  },
  accountId: String,
  summonerLevel: Number,
  profileIconId: Number,
  summonerId: String,
  userId: String,
});

export default mongoose.model('Summoner', SummonerSchema);
