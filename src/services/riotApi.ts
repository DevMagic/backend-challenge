import axios from 'axios';

const riotApi = axios.create({
  baseURL: 'https://br1.api.riotgames.com',
  params: {
    api_key: process.env.RIOT_API_KEY,
  },
});

export default riotApi;