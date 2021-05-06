import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerRepository])],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
