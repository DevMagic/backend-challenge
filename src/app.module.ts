import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { SummonerModule } from "./summoners/summoner.module";
import { DB_CONNECION_URL } from "./database";

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECION_URL, { useCreateIndex: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    SummonerModule,
  ],
})
export class AppModule {}
