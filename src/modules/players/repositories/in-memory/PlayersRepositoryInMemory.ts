import { ICreatePlayerDTO } from "@modules/players/dtos/ICreatePlayerDTO";
import { Player } from "@modules/players/infra/typeorm/entities/Player";

import { IPlayersRepository } from "../IPlayersRepository";

class PlayersRepositoryInMemory implements IPlayersRepository {
  players: Player[] = [];

  async create({
    nickname,
    accountId,
    summonerLevel,
    summonerId,
    profileIconId,
    id,
  }: ICreatePlayerDTO): Promise<Player> {
    const player = new Player();

    Object.assign(player, {
      nickname,
      accountId,
      summonerLevel,
      profileIconId,
      summonerId,
      id: id || player.id,
    });

    this.players.push(player);

    return player;
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.players;
  }
  async findById(id: string): Promise<Player> {
    return this.players.find((player) => player.id === id);
  }
  async findByAccountId(accountId: string): Promise<Player> {
    return this.players.find((player) => player.accountId === accountId);
  }
  async deletePlayer(id: string): Promise<void> {
    const playerIndex = this.players.find((player) => player.id === id);
    this.players.splice(this.players.indexOf(playerIndex));
  }
}

export { PlayersRepositoryInMemory };
