import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Summoner } from "./Summoner";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;
}