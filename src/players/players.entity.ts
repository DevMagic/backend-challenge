import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['accountId','summonerId'])
export class Player extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    name: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    accountId: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    summonerLevel: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    profileIconId: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    summonerId: string;

    @Column({nullable: false, type: 'varchar', length: 200})
    puuid: string

    @Column({nullable: false, type: 'varchar', length: 200})
    revisionDate: string

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}