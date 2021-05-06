import { Injectable, NotFoundException } from '@nestjs/common';
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
    private playerRepository: PlayerRepository,
  ) {}

  /**
   * Creates player service
   * @param createPlayerDto
   * @returns created player
   */
  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerRepository.createPlayer(createPlayerDto);
  }

  /**
   * Updates player service
   * @param id
   * @param updatePlayerDto
   * @returns updated player
   */
  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    return this.playerRepository.updatePlayer(id, updatePlayerDto);
  }

  /**
   * Finds player service
   * @returns list of players
   */
  async find(): Players {
    return this.playerRepository.findPlayers();
  }

  /**
   * Historys player service
   * @returns
   */
  async details(): Promise<any[]> {
    return this.playerRepository.findPlayerWithDetails();
  }
  /**
   * Deletes player service
   * @param id
   * @returns message
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      await this.playerRepository.delete(id);
      return { message: 'successfully deleted' };
    } catch (error) {
      throw new NotFoundException(`Player not found. Details: ${error}`);
    }
  }
}
