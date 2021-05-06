import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto } from './dtos/player.create.dto';
import { UpdatePlayerDto } from './dtos/player.update.dto';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

@ApiTags('Player')
@Controller('players')
export class PlayerController {
  constructor(private summonerService: PlayerService) {}

  /**
   * Posts summoners controller
   * @param createUserDto
   * @returns player
   */
  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  async createPlayer(
    @Body(new ValidationPipe({ transform: true }))
    createUserDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.summonerService.create(createUserDto);
  }

  /**
   * Gets summoners controller
   * @returns summoners
   */
  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async showPlayers(): Promise<any[]> {
    return await this.summonerService.find();
  }

  /**
   * Gets summoners controller
   * @returns details player
   */
  @Get('/details')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async showPlayerDetails(): Promise<any[]> {
    return await this.summonerService.details();
  }

  /**
   * Puts summoners controller
   * @param id
   * @param updatePlayerDto
   * @returns player
   */
  @Put('/edit/:id')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async editPlayer(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return await this.summonerService.update(id, updatePlayerDto);
  }

  /**
   * Deletes summoners controller
   * @param id
   * @returns player by id
   */
  @Delete('/delete/:id')
  @HttpCode(200)
  async deletePlayer(@Param('id') id: string): Promise<{ message: string }> {
    return await this.summonerService.delete(id);
  }
}
