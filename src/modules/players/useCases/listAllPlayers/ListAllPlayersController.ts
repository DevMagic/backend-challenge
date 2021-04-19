import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllPlayersUseCase } from "./ListAllPlayersUseCase";

class ListAllPlayersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllPlayersUseCase = container.resolve(ListAllPlayersUseCase);

    const players = await listAllPlayersUseCase.execute();

    return response.json(players);
  }
}

export { ListAllPlayersController };
