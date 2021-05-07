import { Controller, Delete, Get, Post, Put, Body, Param} from '@nestjs/common';
import { SummonerService } from '../../services/summoner/summoner.service'
import { InjectRepository } from '@nestjs/typeorm';
import { Summoner } from 'src/models/summoner.model';
import { Repository } from 'typeorm';
import { SummonerRequest } from 'src/dto/summoner/summonerDTO';

@Controller('summoner')
export class SummonerController {

    constructor(private readonly summonerService: SummonerService) {}

    @Get()
    findSummoners(){
        return this.summonerService.listAll();
    }

    @Get("details")
    findSummonersWithDetails(){
        return this.summonerService.listAllWithDetails();
    }

    @Post()
    createSummoner(@Body() {summonerName}: SummonerRequest){
        return this.summonerService.createSummoner(summonerName);
    }

    @Put(":id")
    updateSummoner(@Param('id') id: number, @Body() summoner: SummonerRequest){
        return this.summonerService.updateSumonner(id,summoner);
    }

    @Delete(":id")
    deleteSummoner(@Param('id') id: number){
        return this.summonerService.deleteSummoner(id);
    }
    
}
