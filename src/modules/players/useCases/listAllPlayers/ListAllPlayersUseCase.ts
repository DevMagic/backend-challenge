import { Player } from "@modules/players/infra/typeorm/entities/Player";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListAllPlayersUseCase {
  constructor(
    @inject("PlayersRepository")
    private playersRepository: IPlayersRepository
  ) {}

  async execute(): Promise<Player[]> {
    const players = await this.playersRepository.findAllPlayers();

    return players;
  }
}

export { ListAllPlayersUseCase };
