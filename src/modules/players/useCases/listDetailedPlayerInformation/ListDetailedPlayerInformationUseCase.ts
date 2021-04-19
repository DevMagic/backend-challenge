import { Player } from "@modules/players/infra/typeorm/entities/Player";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import getWinLoseRate from "@utils/getWinLoseRate";
import { inject, injectable } from "tsyringe";

interface IResponse {
  wins: number;
  losses: number;
}

@injectable()
class ListDetailedPlayerInformationUseCase {
  constructor(
    @inject("PlayersRepository")
    private playersRepository: IPlayersRepository
  ) {}

  async execute(): Promise<Player[]> {
    const players = await this.playersRepository.findAllPlayers();

    const newPlayers = players.map(async (player) => {
      const winLoses: IResponse = await getWinLoseRate(player.summonerId);

      Object.assign(player, { ...winLoses });

      return player;
    });

    return Promise.all(newPlayers);
  }
}

export { ListDetailedPlayerInformationUseCase };
