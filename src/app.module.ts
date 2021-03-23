import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.services';
import { typeOrmConfig } from './configs/typeorm.config';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}