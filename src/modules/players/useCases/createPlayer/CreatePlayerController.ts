import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePlayerUseCase } from "./CreatePlayerUseCase";

class CreatePlayerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { summonerName } = request.body;

    const createPlayerUseCase = container.resolve(CreatePlayerUseCase);

    const player = await createPlayerUseCase.execute(summonerName);

    return response.status(201).json(player);
  }
}

export { CreatePlayerController };
