import {
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
import { CreateSummonerDto } from './dtos/summoner.create.dto';
import { UpdateSummonerDto } from './dtos/summoner.update.dto';
import { Summoner } from './summoner.entity';
import { SummonerService } from './summoner.service';

@Controller('summoners')
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  /**
   * Posts summoners controller
   * @param createUserDto
   * @returns summoner
   */
  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async createSummoner(
    @Body(new ValidationPipe({ transform: true }))
    createUserDto: CreateSummonerDto,
  ): Promise<Summoner> {
    return await this.summonerService.create(createUserDto);
  }

  /**
   * Gets summoners controller
   * @returns summoners
   */
  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async showSummoners(): Promise<any[]> {
    return await this.summonerService.find();
  }

  /**
   * Gets summoners controller
   * @returns details summoner
   */
  @Get('/details')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async showDetailsSummoner(): Promise<any[]> {
    return await this.summonerService.details();
  }

  /**
   * Puts summoners controller
   * @param id
   * @param updateSummonerDto
   * @returns summoner
   */
  @Put('/edit/:id')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async editSummoner(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSummonerDto: UpdateSummonerDto,
  ): Promise<Summoner> {
    return await this.summonerService.update(id, updateSummonerDto);
  }

  /**
   * Deletes summoners controller
   * @param id
   * @returns summoner by id
   */
  @Delete('/delete/:id')
  @HttpCode(200)
  async deleteSummonerById(@Param('id') id: string): Promise<{ message: string; }> {
    return await this.summonerService.delete(id);
  }
}

