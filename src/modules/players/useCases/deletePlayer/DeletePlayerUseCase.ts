import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
class DeletePlayerUseCase {
  constructor(
    @inject("PlayersRepository")
    private playersRepository: IPlayersRepository
  ) {}
  async execute(id: string): Promise<void> {
    const player = await this.playersRepository.findById(id);

    if (!player) {
      throw new AppError("Player does not exists!");
    }

    await this.playersRepository.deletePlayer(id);
  }
}

export { DeletePlayerUseCase };
