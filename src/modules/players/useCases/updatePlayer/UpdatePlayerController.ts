import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePlayerUseCase } from "./UpdatePlayerUseCase";

class UpdatePlayerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const { summonerName, summonerLevel } = request.body;

    const updatePlayerUseCase = container.resolve(UpdatePlayerUseCase);

    const player = await updatePlayerUseCase.execute({
      id,
      summonerName,
      summonerLevel,
    });

    return response.json(player);
  }
}

export { UpdatePlayerController };
