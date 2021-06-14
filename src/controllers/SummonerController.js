import Summoner from '../models/Summoner.js';
import User from '../models/User.js';
import api from '../services/api.js';
import crypto from 'crypto';

export default {
  async create(request, response) {
    const { summonerName } = request.body;
    const { token, user_id } = request.headers;

    const _id = crypto.randomUUID();

    try {
      const user = await User.findOne({ _id: user_id });

      const { data } = await api.get(
        `/lol/summoner/v4/summoners/by-name/${summonerName}`,
        { headers: { 'X-Riot-Token': token } },
      );
      const { summonerId } = data;

      let summoner = await Summoner.findOne({ id: summonerId });

      if (!summoner) {
        summoner = await Summoner.create({
          _id,
          nickname: data.name,
          accountId: data.accountId,
          summonerLevel: data.summonerLevel,
          profileIconId: data.profileIconId,
          summonerId: data.id,
          userId: user._id,
        });
      }

      return response.json(data);
    } catch (error) {
      return response.json({ error });
    }
  },
  async store(request, response) {},
};
