import axios from "axios";

const apiSummoner = axios.create({
  baseURL: `${process.env.RIOT_HOST}/lol/summoner/v4/summoners/by-name`,
  headers: {
    "X-Riot-Token": process.env.RIOT_KEY,
  },
});

const apiLeague = axios.create({
  baseURL: `${process.env.RIOT_HOST}/lol/league/v4/entries/by-summoner`,
  headers: {
    "X-Riot-Token": process.env.RIOT_KEY,
  },
});

export { apiSummoner, apiLeague };
