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
  userId: {
    type: String,
    required: true,
  }
});

export default mongoose.model('Summoner', SummonerSchema);
