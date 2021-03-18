import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './players.repository';
import { PlayersService } from './players.service';

@Module({
    imports: [TypeOrmModule.forFeature([PlayerRepository])],
    providers: [PlayersService]
})
export class PlayersModule {}
