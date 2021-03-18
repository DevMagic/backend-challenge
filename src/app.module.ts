import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PlayersModule],
  controllers: [],
  providers: [],
})

export class AppModule {}