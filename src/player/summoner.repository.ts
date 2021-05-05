import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  RiotSummonerApi,
  RiotSummonerHistoryApi,
} from './../configs/axios.api';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSummonerDto } from './dtos/summoner.create.dto';
import { UpdateSummonerDto } from './dtos/summoner.update.dto';
import { Summoner } from './summoner.entity';

@EntityRepository(Summoner)
export class SummonerRepository extends Repository<Summoner> {
  /**
   * Creates summoner
   * @param createSummonerDto
   * @returns summoner
   */
  async createSummoner(
    createSummonerDto: CreateSummonerDto,
  ): Promise<Summoner> {
    try {
      const summoner = await this.getRiotSummoner(createSummonerDto);
      await summoner.save();
      return summoner;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error saving player data to the database. Details: ${error}`,
      );
    }
  }

  /**
   * Find summoners
   * @returns summoners
   */
  async findSummoners(): Promise<Summoner[]> {
    try {
      return this.createQueryBuilder('summoner')
        .select([
          'summoner.id',
          'summoner.nickname',
          'summoner.accountId',
          'summoner.summonerLevel',
          'summoner.profileIconId',
          'summoner.summonerId',
        ])
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error when trying to get the list of players. Details: ${error}`,
      );
    }
  }

  /**
   * Find summoners with a sum of wins and losses
   * @returns details
   */
  async findSummonerWithDetails(): Promise<any[]> {
    const summoners = await this.find();

    const listSummonerWithWinsLosses = await Promise.all(
      summoners.map(
        async (summoner): Promise<Summoner> => {
          const { wins, losses } = await this.getWinsLoses(summoner.summonerId);
          summoner['wins'] = wins;
          summoner['losses'] = losses;
          return summoner;
        },
      ),
    );

    return listSummonerWithWinsLosses;
  }

  /**
   * Updates summoner
   * @param id
   * @param updateSummonerDto
   * @returns summoner
   */
  async updateSummoner(
    id: string,
    updateSummonerDto: UpdateSummonerDto,
  ): Promise<Summoner> {
    const { summonerName, summonerLevel } = updateSummonerDto;

    const summoner = await this.findOne(id);

    if (summoner) {
      summoner.nickname = summonerName;
      summoner.summonerLevel = summonerLevel;
    } else {
      throw new NotFoundException('Player not found');
    }

    try {
      await summoner.save();
      return summoner;
    } catch (error) {
      if (error.code.toString() === PostgresErrorCode) {
        throw new ConflictException('Single field is already in use');
      } else {
        throw new InternalServerErrorException(
          'Error when editing the user in the database, the data is been edited',
        );
      }
    }
  }

  /**
   * returns the sum of wins and losses of a summoner
   * @param summonerId
   * @returns  wins: number; losses: number
   */
  private async getWinsLoses(
    summonerId: string,
  ): Promise<{ wins: number; losses: number }> {
    try {
      const RiotSummoner = await RiotSummonerHistoryApi.get(`/${summonerId}`)
        .then((res): any => {
          return res.data;
        })
        .catch((err): never => {
          throw err;
        });
      return this.mapRiotSummonerHistory(RiotSummoner);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error in getting player win and loss records in Riot Games. Details: ${error}`,
      );
    }
  }

  /**
   * gets summoner's information from Riot Games API
   * @param createSummonerDto
   * @returns Summoner
   */
  private async getRiotSummoner(
    createSummonerDto: CreateSummonerDto,
  ): Promise<Summoner> {
    try {
      const { summonerName } = createSummonerDto;

      const RiotSummoner = await RiotSummonerApi.get(`/${summonerName}`)
        .then((res): any => {
          return res.data;
        })
        .catch((err): never => {
          throw err;
        });
      const summoner = this.create();

      this.mapRiotSummonerAttributes(summoner, RiotSummoner);

      return summoner;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting player data from Riot Games. Details: ${error}`,
      );
    }
  }

  /**
   * Mapping Riot summoner attributes to local summoner
   * @param summoner
   * @param RiotSummoner
   */
  private mapRiotSummonerAttributes(summoner: Summoner, RiotSummoner: any) {
    summoner.nickname = RiotSummoner.name;
    summoner.accountId = RiotSummoner.accountId;
    summoner.summonerId = RiotSummoner.id;
    summoner.profileIconId = RiotSummoner.profileIconId;
    summoner.summonerLevel = RiotSummoner.summonerLevel;
  }

  /**
   * Mapping wins and losses from Riot summoner
   * @param RiotSummoner
   * @returns  wins: number; losses: number
   */
  private mapRiotSummonerHistory(
    RiotSummoner: any,
  ): { wins: number; losses: number } {
    let wins = 0;
    let losses = 0;
    RiotSummoner.map((winsLosses): void => {
      wins += winsLosses.wins;
      losses += winsLosses.losses;
    });
    return { wins, losses };
  }
}
