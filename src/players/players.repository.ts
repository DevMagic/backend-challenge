import { EntityRepository, Repository } from "typeorm";
import { Player } from "./players.entity";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {

}