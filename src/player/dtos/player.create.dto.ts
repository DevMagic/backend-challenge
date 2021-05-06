import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty({
    message: 'Please enter the name of the summoner',
  })
  @MaxLength(255, {
    message: 'The summoner name must contain less than 255 characters',
  })
  @MinLength(4, {
    message: 'The summoner name must contain at least 4 characters',
  })
  summonerName: string;
}
