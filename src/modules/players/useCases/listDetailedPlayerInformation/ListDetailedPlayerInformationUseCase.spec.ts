import { PlayersRepositoryInMemory } from "@modules/players/repositories/in-memory/PlayersRepositoryInMemory";

import { CreatePlayerUseCase } from "../createPlayer/CreatePlayerUseCase";
import { ListDetailedPlayerInformationUseCase } from "./ListDetailedPlayerInformationUseCase";

let playerRepositoryInMemory: PlayersRepositoryInMemory;
let createPlayerUseCase: CreatePlayerUseCase;
let listDetailedPlayerInformationUseCase: ListDetailedPlayerInformationUseCase;

describe("List all detailed player information", () => {
  beforeEach(() => {
    playerRepositoryInMemory = new PlayersRepositoryInMemory();
    createPlayerUseCase = new CreatePlayerUseCase(playerRepositoryInMemory);
    listDetailedPlayerInformationUseCase = new ListDetailedPlayerInformationUseCase(
      playerRepositoryInMemory
    );
  });

  it("Should be able to list all player information with details", async () => {
    const player = await createPlayerUseCase.execute("ThrekSor");

    const players = await listDetailedPlayerInformationUseCase.execute();

    expect(players).toEqual([player]);
  }, 10000);
});
