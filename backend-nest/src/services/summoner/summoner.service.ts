import { BadRequestException, HttpException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SummonerRiotResponse, SummonerDTO, SummonerRequest } from 'src/dto/summoner/summonerDTO';
import { Summoner } from 'src/models/summoner.model';
import { Repository } from 'typeorm';

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

    async updateSummoner(id: number, summoner: SummonerRequest): Promise<SummonerDTO> {
        const summonerUpdated = await this.summonerRepository.findOneOrFail(id)
            .catch(err => { throw new NotFoundException(`Summoner with id ${id} not found`) });

        [summonerUpdated.nickname, summonerUpdated.summonerLevel] = 
        [summoner.summonerName,summoner.summonerLevel];

        await this.summonerRepository.update(id,summonerUpdated);
        return summonerUpdated
    }

    async deleteSummoner(id: number): Promise<any> {
        await this.summonerRepository.findOneOrFail(id)
            .catch(err => { throw new NotFoundException(`Summoner with id ${id} not found`) });

        await this.summonerRepository.delete(id);

        return {
            message: "successfully deleted"
        };
    }

    async getSummoner(summonerName: string): Promise<SummonerRiotResponse>{   
        const [URI,config] = this.prepareURI(`/lol/summoner/v4/summoners/by-name/${summonerName}`);

        return await this.httpService.get(URI,config).toPromise().then(res => res.data)
            .catch(err => {
                throw new HttpException("Something went wrong",err.response.status)
            });
    }

    async getSummonersWithDetails(summoners: SummonerDTO[]): Promise<SummonerDTO[]> {
        summoners = await Promise.all(
            summoners.map(async summoner => await this.getDetails(summoner))
        ).catch(err => {
            throw new BadRequestException()
        });

        return summoners;
    }

    async getDetails(summoner: SummonerDTO): Promise<SummonerDTO> {
        const [URI,config] = this.prepareURI(`/lol/league/v4/entries/by-summoner/${summoner.summonerId}`);
        
        [summoner.wins, summoner.losses] = await this.httpService.get(URI,config).toPromise()
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

    prepareURI(endpoint: string): [string,object] {
        const config = {
            headers: {
                "X-riot-token": process.env.RIOT_KEY
            }
        }
        const URI: string = `${process.env.RIOT_API}${endpoint}`;

        return [URI,config]
    }
}
