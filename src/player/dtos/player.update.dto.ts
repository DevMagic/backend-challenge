import { IsNotEmpty, Min, MaxLength, MinLength } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty({
    message: 'Please enter the name of the summoner',
  })
  @MaxLength(255, {
    message: 'The Summoner Name must contain less than 256 characters',
  })
  @MinLength(4, {
    message: 'The summoner name must contain at least 4 characters',
  })
  summonerName: string;

  @IsNotEmpty({
    message: 'Please enter the value of the summoner level',
  })
  @Min(0, {
    message: 'Please report a value greater than or equal to 0',
  })
  summonerLevel: number;
}
