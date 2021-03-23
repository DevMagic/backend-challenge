import { ConflictException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import axios from "axios";
import {apiDetailLeague,apiSimpleLeague} from "src/configs/axios.api";
import { EntityRepository, Repository } from "typeorm";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { EditPlayerDto } from "./dtos/edit-player.dto";
import { Player } from "./players.entity";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const {summonerName} = createPlayerDto;
        
        try {
          var {data} = await apiSimpleLeague.get(`/${summonerName}`)
        } catch (error) {
          throw new NotFoundException("Summoner não foi encontrado")
        }   
             
        const {accountId,name,profileIconId,id,summonerLevel,revisionDate, puuid} = data;
        const player = this.create({accountId,name,profileIconId,summonerId: id,summonerLevel,revisionDate, puuid})
        
        try {
            await player.save()
            return player;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('Campo unico já está em uso');
              } else {
                throw new InternalServerErrorException(
                  'Erro ao salvar o usuário no banco de dados',
                );
              }
        }

    }

    async editPlayerById(editPlayerDto: EditPlayerDto, idPlayer: string): Promise<Player> {
      const {summonerName, summonerLevel} = editPlayerDto;

      const editPlayer = await this.findOne(idPlayer)

      if(editPlayer) {
      editPlayer.name = summonerName;
      editPlayer.summonerLevel = summonerLevel;
      } else {
        throw new NotFoundException("ID de summoner não cadastrado")
      }

      try {
        await editPlayer.save()
        return editPlayer;
      } catch (error) {
        if (error.code.toString() === '23505') {
          throw new ConflictException('Campo unico já está em uso');
        } else {
          throw new InternalServerErrorException(
            'Erro ao editar o usuário no banco de dados, os dados são foram editados',
          );
        }
      }

    }
}