import {
  Inject,
  Injectable,
  HttpService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlayerDto } from './dtos/player.create.dto';
import { UpdatePlayerDto } from './dtos/player.update.dto';
import { Player } from './player.entity';
import { PlayerRepository } from './player.repository';

type Players = Promise<Player[]>;

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerRepository)
    private summonerRepository: PlayerRepository,
  ) {}

  /**
   * Creates summoner service
   * @param createPlayerDto
   * @returns created summoner
   */
  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.summonerRepository.createPlayer(createPlayerDto);
  }

  /**
   * Updates summoner service
   * @param id
   * @param updatePlayerDto
   * @returns updated summoner
   */
  async update(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return this.summonerRepository.updatePlayer(id, updatePlayerDto);
  }

  /**
   * Finds summoner service
   * @returns list of summoners
   */
  async find(): Players {
    return this.summonerRepository.findPlayers();
  }

  /**
   * Historys summoner service
   * @returns
   */
  async details(): Promise<any[]> {
    return this.summonerRepository.findPlayerWithDetails();
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
