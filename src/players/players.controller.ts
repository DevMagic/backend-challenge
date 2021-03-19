import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { EditPlayerDto } from './dtos/edit-player.dto';
import { ReturnUserDto } from './dtos/return-player.dto';
import { Player } from './players.entity';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
    constructor(private playersService: PlayersService){}

    @Post('/create')
    @HttpCode(200)
    async createPlayer(
        @Body() createUserDto: CreatePlayerDto,
    ): Promise<Player> {
        const player = await this.playersService.createPlayer(createUserDto);
        return player
    }

    @Post('/edit')
    @HttpCode(200)
    async editPlayer(
        @Body() editPlayerDto: EditPlayerDto
    ): Promise<Player> {
        const player = await this.playersService.editPlayer(editPlayerDto);
        return player;
    }

    @Get('/')
    @HttpCode(200)
    async showPlayers(): Promise<any[]> {
        const list = this.showPlayers()
        
        return list;
    }
}
