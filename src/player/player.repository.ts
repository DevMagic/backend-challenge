import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { RiotPlayerApi, RiotPlayerHistoryApi } from '../configs/axios.api';
import { CreatePlayerDto } from './dtos/player.create.dto';
import { UpdatePlayerDto } from './dtos/player.update.dto';
import { Player } from './player.entity';

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
  /**
   * Creates player
   * @param createPlayerDto
   * @returns player
   */
  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { summonerName } = createPlayerDto;

    const player = await this.getRiotPlayer(summonerName);

    if (player) {
      try {
        await player.save();
        return player;
      } catch (error) {
        throw new InternalServerErrorException(
          `Error saving player data to the database. ${error}`,
        );
      }
    }
  }

  /**
   * Find players
   * @returns players
   */
  async findPlayers(): Promise<Player[]> {
    try {
      return await this.createQueryBuilder('player')
        .select([
          'player.id',
          'player.nickname',
          'player.accountId',
          'player.summonerLevel',
          'player.profileIconId',
          'player.summonerId',
        ])
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error when trying to get the list of players. ${error}`,
      );
    }
  }

  /**
   * Find players with a sum of wins and losses
   * @returns details
   */
  async findPlayerWithDetails(): Promise<any[]> {
    var players = [];
    try {
      players = await this.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error when trying to get the list of players. ${error}`,
      );
    }

    const listPlayerWithWinsLosses = await Promise.all(
      players.map(
        async (player): Promise<Player> => {
          const { wins, losses } = await this.getWinsLoses(player.summonerId);
          player['wins'] = wins;
          player['losses'] = losses;
          return player;
        },
      ),
    );

    return listPlayerWithWinsLosses;
  }

  /**
   * Updates player
   * @param id
   * @param updatePlayerDto
   * @returns player
   */
  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const { summonerName, summonerLevel } = updatePlayerDto;

    var player;

    try {
      player = await this.findOne(id);
    } catch (error) {
      throw new Error(error);
    }

    if (player) {
      player.nickname = summonerName;
      player.summonerLevel = summonerLevel;
    } else {
      throw new NotFoundException('Player not found');
    }

    try {
      await player.save();
      return player;
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
   * returns the sum of wins and losses of a player
   * @param playerId
   * @returns  wins: number; losses: number
   */
  private async getWinsLoses(
    summonerId: string,
  ): Promise<{ wins: number; losses: number }> {
    try {
      const RiotPlayer = await RiotPlayerHistoryApi.get(`/${summonerId}`).then(
        (res): any => {
          return res.data;
        },
      );
      return this.mapRiotPlayerHistory(RiotPlayer);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error in getting player win and loss records in Riot Games. ${error}`,
      );
    }
  }

  /**
   * gets player's information from Riot Games API
   * @param createPlayerDto
   * @returns Player
   */
  private async getRiotPlayer(summonerName: String): Promise<Player> {
    let RiotPlayer;
    try {
      RiotPlayer = await RiotPlayerApi.get(`/${summonerName}`).then(
        (res): any => {
          return res.data;
        },
      );
    } catch (error) {
      throw new NotFoundException(`Error getting player data from Riot Games.`);
    }
    if (RiotPlayer) {
      if (await this.findOne({ where: { nickname: RiotPlayer.name } })) {
        throw new ConflictException('Nickname is already in use');
      }

      const player = this.create();

      this.mapRiotPlayerAttributes(player, RiotPlayer);

      return player;
    }
  }

  /**
   * Mapping Riot player attributes to local player
   * @param player
   * @param RiotPlayer
   */
  private mapRiotPlayerAttributes(player: Player, RiotPlayer: any) {
    player.nickname = RiotPlayer.name;
    player.accountId = RiotPlayer.accountId;
    player.summonerId = RiotPlayer.id;
    player.profileIconId = RiotPlayer.profileIconId;
    player.summonerLevel = RiotPlayer.summonerLevel;
  }

  /**
   * Mapping wins and losses from Riot player
   * @param RiotPlayer
   * @returns  wins: number; losses: number
   */
  private mapRiotPlayerHistory(
    RiotPlayer: any,
  ): { wins: number; losses: number } {
    let wins = 0;
    let losses = 0;
    RiotPlayer.map((winsLosses): void => {
      wins += winsLosses.wins;
      losses += winsLosses.losses;
    });
    return { wins, losses };
  }
}
