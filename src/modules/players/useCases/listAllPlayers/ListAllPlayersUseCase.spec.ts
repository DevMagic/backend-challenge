import { PlayersRepositoryInMemory } from "@modules/players/repositories/in-memory/PlayersRepositoryInMemory";

import { CreatePlayerUseCase } from "../createPlayer/CreatePlayerUseCase";
import { ListAllPlayersUseCase } from "./ListAllPlayersUseCase";

let playerRepositoryInMemory: PlayersRepositoryInMemory;
let createPlayerUseCase: CreatePlayerUseCase;
let listAllPlayersUseCase: ListAllPlayersUseCase;

describe("List all players", () => {
  beforeEach(() => {
    playerRepositoryInMemory = new PlayersRepositoryInMemory();
    createPlayerUseCase = new CreatePlayerUseCase(playerRepositoryInMemory);
    listAllPlayersUseCase = new ListAllPlayersUseCase(playerRepositoryInMemory);
  });

  it("Should be able to list all players", async () => {
    const player = await createPlayerUseCase.execute("ThrekSor");

    const players = await listAllPlayersUseCase.execute();

    expect(players).toEqual([player]);
  }, 10000);
});
