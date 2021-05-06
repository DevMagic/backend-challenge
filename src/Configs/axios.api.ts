import axios from 'axios';
require('dotenv').config();

export const RiotPlayerApi = axios.create({
  baseURL: 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
  headers: { 'X-Riot-Token': process.env.RIOT_KEY },
});

export const RiotPlayerHistoryApi = axios.create({
  baseURL: 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner',
  headers: { 'X-Riot-Token': process.env.RIOT_KEY },
});
