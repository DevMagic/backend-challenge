import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerRepository])],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
