import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, ValidationPipe } from '@nestjs/common';
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
        @Body(ValidationPipe) createUserDto: CreatePlayerDto,
    ): Promise<Player> {
        const player = await this.playersService.createPlayer(createUserDto);
        return player
    }

    @Put('/edit/:id')
    @HttpCode(200)
    async editPlayer(
        @Param('id') id:string,
        @Body(ValidationPipe) editPlayerDto: EditPlayerDto
    ): Promise<Player> {
        const player = await this.playersService.editPlayer(editPlayerDto,id);
        return player;
    }

    @Get('/')
    @HttpCode(200)
    async showPlayers(): Promise<any[]> {
        const list = this.playersService.showSimplePlayers()
        
        return list;
    }

    @Get('/details')
    @HttpCode(200)
    async showDetailsPlayer(): Promise<any[]> {
        const list = this.playersService.showDetailsPlayers()
        
        return list;
    }

    @Delete('/delete/:id')
    @HttpCode(200)
    async deletePlayerById(
       @Param('id') id:string
    ): Promise<ReturnUserDto> {
        return this.playersService.deletePlayerById(id)
    }
}
