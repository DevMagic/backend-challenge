import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { PlayerService } from 'src/players/player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get() //GET /players/
  async listPlayers() {
    return this.playerService.findAll();
  }

  @Post() //POST /players/
  async newPlayer(@Req() request: Request): Promise<any> {
    const { summonerName } = request.body;

    const res_api = await this.playerService.create({
      summonerName,
    });

    return res_api;
  }

  @Put(':id') //PUT /players/:user_id
  async updatePlayer(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<string> {
    const { summonerName, summonerLevel } = request.body;

    return `Update player: ${id} ======> ${summonerName}, ${summonerLevel}`;
  }

  @Delete(':id') //DELETE /players/:user_id
  async deletePlayer(@Param('id') id: string): Promise<string> {
    return `Delete player: ${id}`;
  }
}
