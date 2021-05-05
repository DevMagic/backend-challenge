import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonerRepository } from './summoner.repository';
import { SummonerService } from './summoner.service';
import { SummonerController } from './summoner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SummonerRepository])],
  providers: [SummonerService],
  controllers: [SummonerController],
})
export class SummonerModule {}
