import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { apiDetailLeague } from "src/configs/axios.api";
import { CreatePlayerDto } from './dtos/create-player.dto';
import { EditPlayerDto } from './dtos/edit-player.dto';
import { Player } from './players.entity';
import { PlayerRepository } from './players.repository';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(PlayerRepository)
        private playerRepository: PlayerRepository
    ) {}

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        return this.playerRepository.createPlayer(createPlayerDto);
    }

    async editPlayer(editPlayerDto: EditPlayerDto, idPlayer: string) : Promise<Player> {
        return this.playerRepository.editPlayerById(editPlayerDto, idPlayer)
    }

    async showSimplePlayers(): Promise<any[]> {
        const players = await this.playerRepository.find()
        const simpleListPlayers = [];
  
        players.map(player => {            
            simpleListPlayers.push({
                id: player.id,
                nickname: player.name,
                accountId: player.accountId,
                summonerLevel: player.summonerLevel,
                profileIconId: player.profileIconId,
                summonerId: player.summonerId,
            })
        })
  
        return simpleListPlayers;
    }

    async showDetailsPlayers(): Promise<any[]> {
        const players = await this.playerRepository.find()
        const detailsListPlayers = [];
  
        for (const player of players) {
          const {data} = await apiDetailLeague.get(`/${player.summonerId}`)
          let totalWins = 0;
          let totalLosses = 0;
  
          if(data.length > 0){
            data.map(modo => {
              totalWins = modo.wins + totalWins;
              totalLosses = modo.losses + totalLosses;
  
              
            })
            detailsListPlayers.push({
              id: player.id,
              nickname: player.name,
              accountId: player.accountId,
              summonerLevel: player.summonerLevel,
              profileIconId: player.profileIconId,
              summonerId: player.summonerId,
              wins: totalWins,
              losses: totalLosses,
            })
          } else {
            detailsListPlayers.push({
              id: player.id,
              nickname: player.name,
              accountId: player.accountId,
              summonerLevel: player.summonerLevel,
              profileIconId: player.profileIconId,
              summonerId: player.summonerId,
              wins: 0,
              losses: 0,
            })
          }
        }
  
        return detailsListPlayers;
    }

    async deletePlayerById(idPlayer: string): Promise<any> {
        try{
            await this.playerRepository.delete(idPlayer)
            return "Summoner foi deletado com sucesso."
        }catch(error){
            throw new NotFoundException("Summoner não foi encontrado para delete")
        }
        return response; 
    }
}
