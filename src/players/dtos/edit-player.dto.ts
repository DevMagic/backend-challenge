import {
    IsNotEmpty,
    MaxLength,
    MinLength
} from 'class-validator'

export class EditPlayerDto {
    
    @IsNotEmpty({
        message: "Gentileza fornecer um ID"
    })
    id: string;

    
    @IsNotEmpty({
        message: "Gentileza fornecer um SummonerName"
    }) 
    @MaxLength(20,{
        message: "SummonerName deve conter menos de 20 caracteres"
    })
    @MinLength(4,{
        message: "SummonerName deve conter no minimo 4 caracteres"
    })   
    summonerName: string;


    @IsNotEmpty({
        message: "Gentileza fornecer um SummonerName"
    })
    @MaxLength(4,{
        message: "SummonerLevel deve conter menos de 4 caracteres"
    })
    @MinLength(1,{
        message: "Nome deve conter no minimo 4 caracteres"
    })
    summonerLevel: string;
}