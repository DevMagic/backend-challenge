import { Document } from "mongoose";
import {
  Body,
  Query,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

import { SummonerDetailedInfo } from "./interfaces/summonerDetailedInfo.interface";
import { UpdateSummonerDto } from "./dto/updateSummoner.dto";
import { CreateSummonerDto } from "./dto/createSummoner.dto";
import { Summoner } from "./interfaces/summoner.interface";
import { SummonerService } from "./summoner.service";

@Controller("summoners")
export class SummonerController {
  constructor(private summonerService: SummonerService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query("detailedInfo") detailedInfo: boolean,
  ): Promise<(Document<Summoner> | SummonerDetailedInfo)[]> {
    return await this.summonerService.getAll(detailedInfo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createSummonerDto: CreateSummonerDto,
  ): Promise<Summoner> {
    return await this.summonerService.create(createSummonerDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ): Promise<Summoner> {
    return this.summonerService.update(id, updateSummonerDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    await this.summonerService.delete(id);

    return { message: "successfully deleted" };
  }
}
