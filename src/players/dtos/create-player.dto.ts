import {
    IsNotEmpty,
    MaxLength,
    MinLength
} from 'class-validator'

  
export class CreatePlayerDto {
    @IsNotEmpty({
        message: 'Informe o nome do invocador',
    })
    @MaxLength(20,{
        message: "Nome deve conter menos de 20 caracteres"
    })
    @MinLength(4,{
        message: "Nome deve conter no minimo 4 caracteres"
    })
    summonerName: string;
}