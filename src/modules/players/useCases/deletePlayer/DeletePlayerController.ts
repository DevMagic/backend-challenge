import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeletePlayerUseCase } from "./DeletePlayerUseCase";

class DeletePlayerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deletePlayerUseCase = container.resolve(DeletePlayerUseCase);

    await deletePlayerUseCase.execute(id);

    return response.status(200).json({ message: "successfully deleted" });
  }
}

export { DeletePlayerController };
