import axios from 'axios'


export const apiSimpleLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
    headers: {
        "X-Riot-Token": "RGAPI-76b9e084-e70f-46a9-9ebd-7eb962887b13"
    }
})

export const apiDetailLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner',
    headers: {
        "X-Riot-Token": "RGAPI-76b9e084-e70f-46a9-9ebd-7eb962887b13"
    }
})

