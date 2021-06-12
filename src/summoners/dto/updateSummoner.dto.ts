import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateSummonerDto {
  @IsString({ message: "The summonerName must to be a string" })
  @IsNotEmpty({ message: "The summomerMame cannot be empty" })
  summonerName: string;

  @IsNumber({}, { message: "The summonerLevel must to be a number" })
  @IsNotEmpty({ message: "The summonerLevel cannot be empty" })
  summonerLevel: number;
}
