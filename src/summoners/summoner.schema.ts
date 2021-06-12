import * as mongoose from "mongoose";
import * as uuid from "node-uuid";

export const SummonerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v1,
    },
    nickname: {
      type: String,
      unique: true,
    },
    accountId: String,
    summonerLevel: Number,
    profileIconId: Number,
    summonerId: String,
  },
  {
    toJSON: {
      transform: (_, ret) => {
        const { _id, ...summoner } = ret;
        delete summoner.__v;
        return { id: _id, ...summoner };
      },
    },
  },
);

export default { name: "Summoner", schema: SummonerSchema };
