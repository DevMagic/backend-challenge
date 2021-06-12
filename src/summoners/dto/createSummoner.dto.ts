import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSummonerDto {
  @IsString({ message: "The summonerName must to be a string" })
  @IsNotEmpty({ message: "The summomerMame cannot be empty" })
  @ApiProperty()
  summonerName: string;
}
