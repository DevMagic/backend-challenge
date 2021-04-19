import { PlayersRepository } from "@modules/players/infra/typeorm/repositories/PlayersRepository";
import { IPlayersRepository } from "@modules/players/repositories/IPlayersRepository";
import { container } from "tsyringe";

container.registerSingleton<IPlayersRepository>(
  "PlayersRepository",
  PlayersRepository
);
