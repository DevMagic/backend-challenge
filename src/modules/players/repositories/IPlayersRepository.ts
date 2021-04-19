import { ICreatePlayerDTO } from "../dtos/ICreatePlayerDTO";
import { Player } from "../infra/typeorm/entities/Player";

interface IPlayersRepository {
  create(data: ICreatePlayerDTO): Promise<Player>;
  findAllPlayers(): Promise<Player[]>;
  findById(id: string): Promise<Player>;
  findByAccountId(accountId: string): Promise<Player>;
  deletePlayer(id: string): Promise<void>;
}

export { IPlayersRepository };
