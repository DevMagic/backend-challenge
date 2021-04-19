import { CreatePlayerController } from "@modules/players/useCases/createPlayer/CreatePlayerController";
import { DeletePlayerController } from "@modules/players/useCases/deletePlayer/DeletePlayerController";
import { ListAllPlayersController } from "@modules/players/useCases/listAllPlayers/ListAllPlayersController";
import { ListDetailedPlayerInformationController } from "@modules/players/useCases/listDetailedPlayerInformation/ListDetailedPlayerInformationController";
import { UpdatePlayerController } from "@modules/players/useCases/updatePlayer/UpdatePlayerController";
import { Router } from "express";

const summonerRoutes = Router();

const createPlayerController = new CreatePlayerController();
const listAllPlayersController = new ListAllPlayersController();
const listDetailedPlayerInformationController = new ListDetailedPlayerInformationController();
const updatePlayerController = new UpdatePlayerController();
const deletePlayerController = new DeletePlayerController();

summonerRoutes.post("/", createPlayerController.handle);
summonerRoutes.put("/:id", updatePlayerController.handle);
summonerRoutes.delete("/:id", deletePlayerController.handle);
summonerRoutes.get("/all", listAllPlayersController.handle);
summonerRoutes.get(
  "/all/detailed",
  listDetailedPlayerInformationController.handle
);

export { summonerRoutes };
