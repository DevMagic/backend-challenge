import { IsNotEmpty, IsString } from "class-validator";

export class CreateSummonerDto {
  @IsString({ message: "The summonerName must to be a string" })
  @IsNotEmpty({ message: "The summomerMame cannot be empty" })
  summonerName: string;
}
