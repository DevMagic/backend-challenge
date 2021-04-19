import { ICreatePlayerDTO } from "@modules/players/dtos/ICreatePlayerDTO";
import { Player } from "@modules/players/infra/typeorm/entities/Player";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  summonerName: string;
  summonerLevel: number;
}

@injectable()
class UpdatePlayerUseCase {
  constructor(
    @inject("PlayersRepository")
    private playersRepository: IPlayersRepository
  ) {}
  async execute({
    id,
    summonerLevel,
    summonerName,
  }: IRequest): Promise<Player> {
    const player = await this.playersRepository.findById(id);

    if (!player) {
      throw new AppError("Player does not exists!");
    }

    player.summonerLevel = summonerLevel;
    player.nickname = summonerName;

    await this.playersRepository.create(player);

    return player;
  }
}

export { UpdatePlayerUseCase };
