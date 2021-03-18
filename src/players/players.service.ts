import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from './players.repository';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(PlayerRepository)
        private playerRepository: PlayerRepository
    ) {}
}
