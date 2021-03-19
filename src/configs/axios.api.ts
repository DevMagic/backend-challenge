import axios from 'axios'


const api = axios.create({
    baseURL: 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name',
    headers: {
        "X-Riot-Token": "RGAPI-29252515-e965-446c-850f-6ba5dcb7511f"
    }
})

export default api;