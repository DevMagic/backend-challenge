import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'summoner' })
export class Summoner {
    @PrimaryGeneratedColumn()
    id: number;

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
}
