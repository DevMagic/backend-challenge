import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";

import {
  DetailedInfo,
  SummonerDetailedInfo,
} from "./interfaces/summonerDetailedInfo.interface";
import { RecordNotFoundException } from "../exceptions/recordNotFund.exception";
import { CreateSummonerDto } from "./dto/createSummoner.dto";
import { UpdateSummonerDto } from "./dto/updateSummoner.dto";
import { Summoner } from "./interfaces/summoner.interface";
import { httpClient } from "../http";

@Injectable()
export class SummonerService {
  constructor(
    @InjectModel("Summoner") private readonly summonerModel: Model<Summoner>,
  ) {}

  async fetchSummonerByName(summonerName: string): Promise<any> {
    try {
      const response = await httpClient.get(
        `/summoner/v4/summoners/by-name/${summonerName}`,
      );

      return response.data;
    } catch (error) {
      if (error.response.status === HttpStatus.NOT_FOUND)
        throw new RecordNotFoundException(summonerName);
      else throw new InternalServerErrorException();
    }
  }

  async fetchDetailedInformationById(
    summonerId: string,
  ): Promise<DetailedInfo[]> {
    const { data } = await httpClient.get<DetailedInfo[]>(
      `/league/v4/entries/by-summoner/${summonerId}`,
    );

    return data;
  }

  async getAll(
    detailedInfo?: boolean,
  ): Promise<(Document<Summoner> | SummonerDetailedInfo)[]> {
    const summoners = await this.summonerModel.find().exec();
    return detailedInfo
      ? await this.getAllDetailedInformation(summoners)
      : summoners;
  }

  async getAllDetailedInformation(
    summoners: Document<Summoner>[],
  ): Promise<SummonerDetailedInfo[]> {
    const promises = summoners.map(async (document) => {
      const summoner = document.toJSON() as Summoner;

      const details = await this.fetchDetailedInformationById(
        summoner.summonerId,
      );

      const result = details.reduce(
        (prev, curr) => ({
          wins: prev.wins + curr.wins,
          losses: prev.losses + curr.losses,
        }),
        { wins: 0, losses: 0 },
      );

      return { ...summoner, ...result };
    });

    return Promise.all(promises);
  }

  async create({ summonerName }: CreateSummonerDto): Promise<Summoner> {
    const { name, accountId, summonerLevel, profileIconId, id } =
      await this.fetchSummonerByName(summonerName);

    const createdSummoner = new this.summonerModel({
      nickname: name,
      accountId,
      summonerLevel,
      profileIconId,
      summonerId: id,
    });

    return await createdSummoner.save();
  }

  async update(
    _id: string,
    { summonerName, summonerLevel }: UpdateSummonerDto,
  ): Promise<Summoner> {
    try {
      await this.summonerModel
        .updateOne({ _id, nickname: summonerName, summonerLevel })
        .exec();
      return await this.summonerModel.findById(_id).exec();
    } catch {
      throw new RecordNotFoundException(summonerName);
    }
  }

  async delete(_id: string): Promise<void> {
    const { deletedCount } = await this.summonerModel.deleteOne({ _id }).exec();

    if (deletedCount === 0) throw new RecordNotFoundException(_id);
  }
}
