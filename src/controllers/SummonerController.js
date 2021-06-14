import Summoner from '../models/Summoner.js';
import User from '../models/User.js';
import api from '../services/api.js';
import crypto from 'crypto';

export default {
  async create(request, response) {
    const { summonerName } = request.body;
    const { token, user_id } = request.headers;

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
          _id: crypto.randomUUID(),
          nickname: data.name,
          accountId: data.accountId,
          summonerLevel: data.summonerLevel,
          profileIconId: data.profileIconId,
          summonerId: data.id,
          userId: user._id,
        });
      }

      return response.status(201).json(data);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async index(request, response) {
    const { user_id } = request.headers;
    const summoners = await Summoner.findOne({ userId: user_id });

    return response.status(200).json(summoners);
  },
};
