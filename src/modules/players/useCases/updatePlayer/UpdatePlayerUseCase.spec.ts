import { PlayersRepositoryInMemory } from "@modules/players/repositories/in-memory/PlayersRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreatePlayerUseCase } from "../createPlayer/CreatePlayerUseCase";
import { UpdatePlayerUseCase } from "./UpdatePlayerUseCase";

let playerRepositoryInMemory: PlayersRepositoryInMemory;
let createPlayerUseCase: CreatePlayerUseCase;
let updatePlayerUseCase: UpdatePlayerUseCase;

describe("Update Player", () => {
  beforeEach(() => {
    playerRepositoryInMemory = new PlayersRepositoryInMemory();
    createPlayerUseCase = new CreatePlayerUseCase(playerRepositoryInMemory);
    updatePlayerUseCase = new UpdatePlayerUseCase(playerRepositoryInMemory);
  });

  it("Should be able to update a player", async () => {
    const player = await createPlayerUseCase.execute("OldWolfKing");

    const playerUpdated = await updatePlayerUseCase.execute({
      id: player.id,
      summonerName: "OldWolfKingMaster",
      summonerLevel: 550,
    });

    expect(playerUpdated.nickname).toBe("OldWolfKingMaster");
    expect(playerUpdated.summonerLevel).toBe(550);
  }, 10000);

  it("Should not be able to update a non-existent player", async () => {
    await expect(() =>
      updatePlayerUseCase.execute({
        id: "noexistent123456",
        summonerName: "OldWolfKingMaster",
        summonerLevel: 550,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
