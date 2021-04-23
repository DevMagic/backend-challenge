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

  @Get('/details') //GET /players/details
  async detailsPlayers() {
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
  async updatePlayer(@Param('id') id: string, @Req() request: Request) {
    const { summonerName, summonerLevel } = request.body;

    return this.playerService.update({ id, summonerName, summonerLevel });
  }

  @Delete(':id') //DELETE /players/:user_id
  async deletePlayer(@Param('id') id: string): Promise<any> {
    await this.playerService.delete({ id });
    return { message: 'successfully deleted' };
  }
}
