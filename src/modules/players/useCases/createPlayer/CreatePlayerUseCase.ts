import { apiSummoner } from "@config/axios";
import { Player } from "@modules/players/infra/typeorm/entities/Player";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
class CreatePlayerUseCase {
  constructor(
    @inject("PlayersRepository")
    private playerRepository: IPlayersRepository
  ) {}
  async execute(summonerName: string): Promise<Player> {
    const data = await apiSummoner
      .get(`/${summonerName}`)
      .then((response) => response.data)
      .catch((err) => {
        throw new AppError(`Something went wrong: ${err}`);
      });

    const { name, profileIconId, id, summonerLevel, accountId } = data;

    const playerExists = await this.playerRepository.findByAccountId(accountId);

    if (playerExists) {
      throw new AppError("Player already exists");
    }

    const player = await this.playerRepository.create({
      nickname: name as string,
      profileIconId,
      summonerId: id as string,
      summonerLevel,
      accountId,
    });

    return player;
  }
}

export { CreatePlayerUseCase };
