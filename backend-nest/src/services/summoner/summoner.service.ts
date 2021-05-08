import { BadRequestException, HttpException, HttpService, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, throwError } from 'rxjs';
import { SummonerRiotResponse, SummonerDTO, SummonerRequest } from 'src/dto/summoner/summonerDTO';
import { Summoner } from 'src/models/summoner.model';
import { Repository } from 'typeorm';
import { AxiosResponse } from "axios";
import { exception } from 'console';

@Injectable()
export class SummonerService {
    constructor(
        @InjectRepository(Summoner)
        private summonerRepository: Repository<Summoner>,
        private httpService: HttpService
    ) { }

    async listAll(): Promise<Summoner[]> {
        return this.summonerRepository.find();
    }

    async listAllWithDetails(): Promise<SummonerDTO[]> {
        const summoners: Summoner[] = await this.summonerRepository.find();

        const summonersDTO: SummonerDTO[] = await this.getSummonersWithDetails(summoners);
        return summonersDTO;
    }

    async createSummoner(summonerName: string): Promise<SummonerDTO> {
        const player: SummonerRiotResponse = await this.getSummoner(summonerName);
        
        if(await this.summonerRepository.findOne({summonerId:player.id}))
            throw new BadRequestException("Summoner already registered in the system");

        const summoner: SummonerDTO = {
            nickname: player.name,
            accountId: player.accountId,
            summonerLevel: player.summonerLevel,
            profileIconId: player.profileIconId,
            summonerId: player.id
        }

        return this.summonerRepository.save(summoner);
    }

    async updateSumonner(id: number, summoner: SummonerRequest): Promise<any> {

        return await this.summonerRepository.update(id,
            { nickname: summoner.summonerName, summonerLevel: summoner.summonerLevel });
    }

    async deleteSummoner(id: number): Promise<any> {
       return await this.summonerRepository.delete(id);
    }

    async getSummoner(summonerName: string): Promise<SummonerRiotResponse>{
        const URI: string = `${process.env.RIOT_API}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_KEY}`;
       
        return await this.httpService.get(URI).toPromise().then(res => res.data)
            .catch(err => {
                throw new HttpException("Something went wrong",err.response.status)
            });
    }

    async getSummonersWithDetails(summoners: SummonerDTO[]): Promise<SummonerDTO[]> {
        summoners = await Promise.all(
            summoners.map(async summoner => await this.getDetails(summoner))
        )
         return summoners;
    }

    async getDetails(summoner: SummonerDTO): Promise<SummonerDTO> {
        const URI: string = `${process.env.RIOT_API}/lol/league/v4/entries/by-summoner/${summoner.summonerId}?api_key=${process.env.RIOT_KEY}`;
       
        [summoner.wins, summoner.losses] = await this.httpService.get(URI).toPromise()
            .then(res => res.data)
            .then(sum => {
                let wins: number = 0;
                let losses: number = 0;
                sum.forEach(element => {
                    wins += element.wins;
                    losses += element.losses    
                });
                return [wins,losses];
            });
        return summoner;
    }

}
