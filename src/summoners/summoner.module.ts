import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { RecordNotFoundException } from "../exceptions/recordNotFund.exception";
import { SummonerController } from "./summoner.controller";
import { SummonerService } from "./summoner.service";
import SummonerSchema from "./summoner.schema";

@Module({
  imports: [MongooseModule.forFeature([SummonerSchema])],
  controllers: [SummonerController],
  providers: [SummonerService, RecordNotFoundException],
})
export class SummonerModule {}
