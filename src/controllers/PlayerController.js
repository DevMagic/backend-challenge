import Summoner from '../models/Summoner.js';
import api from '../services/api.js';
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

async function getAPIData(summonerId) {
  const apiToken = process.env.API_TOKEN;

  const { data } = await api.get(
    `/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiToken}`,
  );

  return data;
}

async function getDetailedList(summoners) {
  let detailedList = [];

  for (const summoner of summoners) {
    const data = await getAPIData(summoner.summonerId);
    let wins = 0;
    let losses = 0;

    for (const dataItem of data) {
      wins += dataItem.wins;
      losses += dataItem.losses;
    }

    const detailedListItem = {
      _id: summoner._id,
      nickname: summoner.nickname,
      accountId: summoner.accountId,
      summonerLevel: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
      summonerId: summoner.summonerId,
      userId: summoner.userId,
      wins,
      losses,
    };

    detailedList.push(detailedListItem);
  }

  return detailedList;
}

export default {
  async index(request, response) {
    try {
      const { challenge_token } = request.headers;
      const { nickname, summonerLevel, wins, losses } = request.query;
      const userId = await verifyToken(challenge_token);

      const summoners = await Summoner.find({ userId });
      const detailedList = await getDetailedList(summoners);

      if (nickname || summonerLevel || wins || losses) {
        function filterItems(item) {
          if (
            (String(item.nickname) === String(nickname) && nickname) ||
            (Number(item.summonerLevel) === Number(summonerLevel) &&
              summonerLevel) ||
            (Number(item.wins) === Number(wins) && wins) ||
            (Number(item.losses) === Number(losses) && losses)
          ) {
            return item;
          }
        }

        const filteredList = detailedList.filter(filterItems);

        return response.status(200).json(filteredList);
      } else {
        return response.status(200).json(detailedList);
      }
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async update(request, response) {
    try {
      const { challenge_token, _id } = request.headers;
      const { summonerName, summonerLevel } = request.body;
      const userId = await verifyToken(challenge_token);

      const summoner = await Summoner.findOneAndUpdate(
        { userId, _id },
        { nickname: summonerName, summonerLevel },
        {
          returnOriginal: false,
        },
      );

      return response.status(200).json(summoner);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },
};
