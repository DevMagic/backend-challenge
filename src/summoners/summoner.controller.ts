import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
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

@ApiTags("summoners")
@Controller("summoners")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Internal Server Error",
})
export class SummonerController {
  constructor(private summonerService: SummonerService) {}

  @Get()
  @ApiQuery({ name: "detailedInfo", type: "boolean", required: false })
  @ApiResponse({ status: HttpStatus.OK, description: "OK" })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query("detailedInfo") detailedInfo: boolean,
  ): Promise<(Document<Summoner> | SummonerDetailedInfo)[]> {
    return await this.summonerService.getAll(detailedInfo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The summoner has been successfully created.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The Record not found or non existent",
  })
  public async create(
    @Body() createSummonerDto: CreateSummonerDto,
  ): Promise<Summoner> {
    return await this.summonerService.create(createSummonerDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Summoner has been successfully updated.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The Record not found or non existent",
  })
  async update(
    @Param("id") id: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ): Promise<Summoner> {
    return this.summonerService.update(id, updateSummonerDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The summoner was successfully deleted.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The Record not found or non existent",
  })
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    await this.summonerService.delete(id);

    return { message: "successfully deleted" };
  }
}
