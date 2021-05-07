import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Summoner } from './models/summoner.model';
import { SummonerController } from './controllers/summoner/summoner.controller';
import { SummonerService } from './services/summoner/summoner.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Summoner]
    }),
    TypeOrmModule.forFeature([Summoner]),
    HttpModule
  ],
  controllers: [AppController, SummonerController],
  providers: [AppService, SummonerService],
})
export class AppModule {}
