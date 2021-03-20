import axios from 'axios'


export const apiSimpleLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
    headers: {
        "X-Riot-Token": "RGAPI-ddf9b090-bf78-4aeb-a316-76741a0c647b"
    }
})

export const apiDetailLeague = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner',
    headers: {
        "X-Riot-Token": "RGAPI-ddf9b090-bf78-4aeb-a316-76741a0c647b"
    }
})

