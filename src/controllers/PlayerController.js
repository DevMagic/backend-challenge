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
    `/lol/league/v4/entries/by-summoner/${summonerId}`,
    { headers: { 'X-Riot-Token': apiToken } },
  );

  return data;
}

export default {
  async index(request, response) {
    const { challenge_token } = request.headers;
    const { nickname, summonerLevel, wins, losses } = request.query;

    try {
      const userId = await verifyToken(challenge_token);
      const summoner = await Summoner.findOne({ userId, nickname });

      const data = await getAPIData(summoner.summonerId);

      let detailedList = [];

      for (const item of data) {
        const { wins, losses } = item;

        const summonerItem = {
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

        detailedList.push(summonerItem);
      }

      return response.status(200).json(detailedList);

      // console.log(data);
      // let finalData = [];

      // data.forEach((item) => {
      //   const { wins, losses } = item;
      //   const summonerItem = summoner;
      //   summonerItem.concat(wins);

      //   finalData.push(summonerItem);
      //   console.log(summonerItem);
      // });
    } catch (error) {
      return response.status(400).json({ error });
    }
  },
};
