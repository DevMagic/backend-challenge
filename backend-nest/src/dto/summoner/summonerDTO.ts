export interface SummonerDTO {
    id?: number;
    nickname: string;
    accountId: string;
    summonerLevel: number;
    profileIconId: number;
    summonerId: string;
    wins?: number;
    losses?: number;
}

export interface SummonerRiotResponse {
    id: string;
    name: string;
    accountId: string;
    summonerLevel: number;
    profileIconId: number;
}

export interface SummonerRequest {
    summonerName: string;
    summonerLevel?: number;
}