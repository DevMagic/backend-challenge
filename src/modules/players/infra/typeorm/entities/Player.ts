import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("summoners")
class Player {
  @PrimaryColumn()
  id?: string;

  @Column()
  nickname: string;

  @Column()
  accountId: string;

  @Column()
  summonerLevel: number;

  @Column()
  profileIconId: number;

  @Column()
  summonerId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export { Player };
