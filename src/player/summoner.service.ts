import {
  Inject,
  Injectable,
  HttpService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSummonerDto } from './dtos/summoner.create.dto';
import { UpdateSummonerDto } from './dtos/summoner.update.dto';
import { Summoner } from './summoner.entity';
import { SummonerRepository } from './summoner.repository';

type Summoners = Promise<Summoner[]>;

@Injectable()
export class SummonerService {
  constructor(
    @InjectRepository(SummonerRepository)
    private summonerRepository: SummonerRepository,
  ) {}

  /**
   * Creates summoner service
   * @param createSummonerDto
   * @returns created summoner
   */
  async create(createSummonerDto: CreateSummonerDto): Promise<Summoner> {
    return this.summonerRepository.createSummoner(createSummonerDto);
  }

  /**
   * Updates summoner service
   * @param id
   * @param updateSummonerDto
   * @returns updated summoner
   */
  async update(
    id: string,
    updateSummonerDto: UpdateSummonerDto,
  ): Promise<Summoner> {
    return this.summonerRepository.updateSummoner(id, updateSummonerDto);
  }

  /**
   * Finds summoner service
   * @returns list of summoners
   */
  async find(): Summoners {
    return this.summonerRepository.findSummoners();
  }

  /**
   * Historys summoner service
   * @returns
   */
  async details(): Promise<any[]> {
    return this.summonerRepository.findSummonerWithDetails();
  }
  /**
   * Deletes summoner service
   * @param id
   * @returns message
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      await this.summonerRepository.delete(id);
      return { message: 'successfully deleted' };
    } catch (error) {
      throw new NotFoundException(`Player not found. Details: ${error}`);
    }
  }
}
