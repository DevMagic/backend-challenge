import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './players.repository';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PlayerRepository])],
    providers: [PlayersService],
    controllers: [PlayersController]
})
export class PlayersModule {}
