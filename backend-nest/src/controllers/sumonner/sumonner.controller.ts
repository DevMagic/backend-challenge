import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summoner } from 'src/models/summoner.model';
import { Repository } from 'typeorm';

@Controller('sumonner')
export class SumonnerController {
    constructor(
        @InjectRepository(Summoner)
        private summonerRepository: Repository<Summoner>
    ) {}
}
