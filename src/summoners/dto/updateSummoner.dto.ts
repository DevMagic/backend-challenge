import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSummonerDto {
  @IsString({ message: "The summonerName must to be a string" })
  @IsNotEmpty({ message: "The summomerMame cannot be empty" })
  @ApiProperty()
  summonerName: string;

  @IsNumber({}, { message: "The summonerLevel must to be a number" })
  @IsNotEmpty({ message: "The summonerLevel cannot be empty" })
  @ApiProperty()
  summonerLevel: number;
}
