import { Controller, Delete, Get, Post, Put, Body, Param, BadRequestException} from '@nestjs/common';
import { SummonerService } from '../../services/summoner/summoner.service'
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
        if(!summonerName)
            throw new BadRequestException("summonerName should not be null");

        return this.summonerService.createSummoner(summonerName);
    }

    @Put(":id")
    updateSummoner(@Param('id') id: number, @Body() summoner: SummonerRequest){
        if(!(summoner.summonerName && summoner.summonerLevel))
            throw new BadRequestException("summonerName and summonerLevel should not be null")

        return this.summonerService.updateSummoner(id,summoner);
    }

    @Delete(":id")
    deleteSummoner(@Param('id') id: number){
        return this.summonerService.deleteSummoner(id);
    }
    
}
