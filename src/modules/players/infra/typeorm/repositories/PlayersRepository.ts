import { ICreatePlayerDTO } from "@modules/players/dtos/ICreatePlayerDTO";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { getRepository, Repository } from "typeorm";

import { Player } from "../entities/Player";

class PlayersRepository implements IPlayersRepository {
  private repository: Repository<Player>;

  constructor() {
    this.repository = getRepository(Player);
  }

  async create({
    nickname,
    accountId,
    summonerLevel,
    summonerId,
    profileIconId,
    id,
  }: ICreatePlayerDTO): Promise<Player> {
    const player = this.repository.create({
      nickname,
      accountId,
      summonerLevel,
      profileIconId,
      summonerId,
      id,
    });

    await this.repository.save(player);

    return player;
  }

  async findAllPlayers(): Promise<Player[]> {
    const players = await this.repository.find({
      select: [
        "id",
        "nickname",
        "accountId",
        "summonerLevel",
        "profileIconId",
        "summonerId",
      ],
    });

    return players;
  }

  async findById(id: string): Promise<Player> {
    const player = await this.repository.findOne(id);

    return player;
  }

  async findByAccountId(accountId: string): Promise<Player> {
    const player = await this.repository.findOne({ accountId });

    return player;
  }

  async deletePlayer(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}

export { PlayersRepository };
