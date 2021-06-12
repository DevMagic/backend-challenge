import { Summoner } from "./summoner.interface";

export interface DetailedInfo {
  wins: number;
  losses: number;
}

export type SummonerDetailedInfo = DetailedInfo & Summoner;
