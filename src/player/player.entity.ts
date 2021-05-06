import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('player')
@Unique(['id', 'nickname', 'accountId', 'profileIconId', 'summonerId'])
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  nickname: string;

  //Encrypted account ID. Max length 56 characters.
  @Column({ nullable: false, type: 'varchar', length: 56 })
  accountId: string;

  @Column({ nullable: false, type: 'bigint' })
  summonerLevel: number;

  @Column({ nullable: false })
  profileIconId: number;

  //Encrypted summoner ID. Max length 63 characters.
  @Column({ nullable: false, type: 'varchar', length: 63 })
  summonerId: string;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
