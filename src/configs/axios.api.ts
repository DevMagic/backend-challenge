import axios from 'axios'
require("dotenv").config()

export const apiSimpleLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
    headers: {
        "X-Riot-Token": process.env.API_KEY
    }
})

export const apiDetailLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner',
    headers: {
        "X-Riot-Token": process.env.API_KEY
    }
})

