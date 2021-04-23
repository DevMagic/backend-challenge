import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PlayerService } from 'src/players/player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get() //GET /players/
  async listPlayers() {
    try {
      return this.playerService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          message: `Erro ao buscar a lista de Summoners`,
          success: false,
          error,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/details') //GET /players/details
  async detailsPlayers() {
    try {
      // eslint-disable-next-line prefer-const
      let players = await this.playerService.findAll();
      //get and map all summoners

      const newArrayPlayers = await Promise.all(
        players.map(async (player) => {
          const { wins, loses } = await this.playerService.winsAndLoses({
            summonerId: player.SummonerId,
          });
          player['wins'] = wins;
          player['loses'] = loses;
          return player;
        }),
      );

      return newArrayPlayers;
    } catch (error) {
      throw new HttpException(
        {
          message: `Erro ao buscar informações detalhadas dos Summoners`,
          success: false,
          error: error.message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post() //POST /players/
  async newPlayer(@Req() request: Request): Promise<any> {
    try {
      const { summonerName } = request.body;

      const res_api = await this.playerService.create({
        summonerName,
      });

      return res_api;
    } catch (error) {
      throw new HttpException(
        {
          message: `Erro ao adicionar um Summoner`,
          success: false,
          error: error.message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id') //PUT /players/:user_id
  async updatePlayer(@Param('id') id: string, @Req() request: Request) {
    try {
      const { summonerName, summonerLevel } = request.body;

      return this.playerService.update({ id, summonerName, summonerLevel });
    } catch (error) {
      throw new HttpException(
        {
          message: `Erro ao adicionar um Summoner`,
          success: false,
          error: error.message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id') //DELETE /players/:user_id
  async deletePlayer(@Param('id') id: string): Promise<any> {
    try {
      await this.playerService.delete({ id });
      return { message: 'successfully deleted' };
    } catch (error) {
      throw new HttpException(
        {
          message: `Erro ao deletar um Summoner`,
          success: false,
          error: error.message,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
