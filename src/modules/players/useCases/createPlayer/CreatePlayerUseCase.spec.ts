import { PlayersRepositoryInMemory } from "@modules/players/repositories/in-memory/PlayersRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreatePlayerUseCase } from "./CreatePlayerUseCase";

let playerRepositoryInMemory: PlayersRepositoryInMemory;
let createPlayerUseCase: CreatePlayerUseCase;

describe("Create Player", () => {
  beforeEach(() => {
    playerRepositoryInMemory = new PlayersRepositoryInMemory();
    createPlayerUseCase = new CreatePlayerUseCase(playerRepositoryInMemory);
  });

  it("Should be able to create a new player", async () => {
    const summonerName = "OldWolfKing";

    const player = await createPlayerUseCase.execute(summonerName);

    expect(player).toHaveProperty("id");
  }, 10000);

  it("Should not be able to create a new player if the player is already registered", async () => {
    const summonerName = "OldWolfKing";

    await createPlayerUseCase.execute(summonerName);

    await expect(() =>
      createPlayerUseCase.execute("Old Wolf King")
    ).rejects.toBeInstanceOf(AppError);
  }, 10000);

  it("Should not be able to create a new player if the player name does not exists", async () => {
    await expect(() =>
      createPlayerUseCase.execute("thisnamedoesntexists")
    ).rejects.toBeInstanceOf(AppError);
  }, 10000);
});
