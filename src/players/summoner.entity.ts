import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Summoner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Nickname: string;

  @Column()
  AccountId: string;

  @Column()
  SummonerLevel: number;

  @Column()
  ProfileIconId: string;

  @Column()
  SummonerId: string;
}
