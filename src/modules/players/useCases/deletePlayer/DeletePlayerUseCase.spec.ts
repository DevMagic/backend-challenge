import { PlayersRepositoryInMemory } from "@modules/players/repositories/in-memory/PlayersRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreatePlayerUseCase } from "../createPlayer/CreatePlayerUseCase";
import { DeletePlayerUseCase } from "./DeletePlayerUseCase";

let playerRepositoryInMemory: PlayersRepositoryInMemory;
let createPlayerUseCase: CreatePlayerUseCase;
let deletePlayerUseCase: DeletePlayerUseCase;

describe("Delete Player", () => {
  beforeEach(() => {
    playerRepositoryInMemory = new PlayersRepositoryInMemory();
    createPlayerUseCase = new CreatePlayerUseCase(playerRepositoryInMemory);
    deletePlayerUseCase = new DeletePlayerUseCase(playerRepositoryInMemory);
  });

  it("Should be able to delete a player", async () => {
    const deletePlayer = spyOn(playerRepositoryInMemory, "deletePlayer");

    const player = await createPlayerUseCase.execute("OldWolfKing");

    await deletePlayerUseCase.execute(player.id);

    expect(deletePlayer).toHaveBeenCalled();
  }, 10000);

  it("Should not be able to delete a non-existent player", async () => {
    await expect(() =>
      deletePlayerUseCase.execute("Leonard Burns")
    ).rejects.toBeInstanceOf(AppError);
  });
});
