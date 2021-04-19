import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListDetailedPlayerInformationUseCase } from "./ListDetailedPlayerInformationUseCase";

class ListDetailedPlayerInformationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listDetailedPlayerInformationUseCase = container.resolve(
      ListDetailedPlayerInformationUseCase
    );

    const playersDetailed = await listDetailedPlayerInformationUseCase.execute();

    return response.json(playersDetailed);
  }
}

export { ListDetailedPlayerInformationController };
