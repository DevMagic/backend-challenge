import Summoner from '../models/Summoner.js';
import api from '../services/api.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function verifyToken(challenge_token) {
  let decodedToken = '';
  if (!challenge_token)
    return response
      .status(401)
      .json({ auth: false, message: 'No token provided.' });

  jwt.verify(challenge_token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return response
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });

    decodedToken = decoded;
  });

  return decodedToken._id;
}

async function getAPIData(summonerName) {
  const apiToken = process.env.API_TOKEN;

  const { data } = await api.get(
    `/lol/summoner/v4/summoners/by-name/${summonerName}`,
    { headers: { 'X-Riot-Token': apiToken } },
  );

  return data;
}

export default {
  async create(request, response) {
    const { summonerName } = request.body;
    const { challenge_token } = request.headers;

    try {
      //Test if JWT is valid
      const userId = await verifyToken(challenge_token);

      //If JWT is valid try to get info from Riot API
      const data = await getAPIData(summonerName);
      const { id, name, accountId, summonerLevel, profileIconId } = data;

      let summoner = await Summoner.findOne({ summonerId: id });

      if (!summoner) {
        summoner = await Summoner.create({
          _id: crypto.randomUUID(),
          nickname: name,
          accountId,
          summonerLevel,
          profileIconId,
          summonerId: id,
          userId
        });
        return response.status(201).json(summoner);
      }

      return response.status(200).json(summoner);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async index(request, response) {
    const { challenge_token } = request.headers;
    const userId = await verifyToken(challenge_token);

    try {
      const summoners = await Summoner.find({ userId });
      if (summoners) {
        return response.status(200).json(summoners);
      } else if (!summoners) {
        return response.status(404).json({ error: 'Data not found' });
      }
    } catch (error) {
      return response.status(400).json({ error });
    }
  },
};
