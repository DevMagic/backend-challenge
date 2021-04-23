import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summoner } from 'src/players/summoner.entity';
import { Repository } from 'typeorm';

interface RequestDTO {
  summonerName: string;
}

interface ResponseSummoner {
  accountId: string;
}

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
    private httpService: HttpService,
  ) {}

  async create({ summonerName }: RequestDTO): Promise<ResponseSummoner> {
    const player = await this.httpService
      .get(
        `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_KEY}`,
      )
      .toPromise()
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        throw err;
      });
    //add player in db
    const summoner = new Summoner();
    summoner.Nickname = player.name;
    summoner.AccountId = player.accountId;
    summoner.SummonerLevel = player.summonerLevel;
    summoner.ProfileIconId = player.profileIconId;
    summoner.SummonerId = player.id;

    this.summonerRepository.save(summoner);
    return player;
  }

  async findAll(): Promise<Summoner[]> {
    return this.summonerRepository.find();
  }

  async winsAndLoses({ summonerId }) {
    const playerHist = await this.httpService
      .get(
        `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${process.env.RIOT_KEY}`,
      )
      .toPromise()
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        throw err;
      });
    let wins = 0;
    let loses = 0;
    playerHist.map((typeGame) => {
      wins += typeGame.wins;
      loses += typeGame.losses;
    });
    return { wins, loses };
  }

  async update({ id, summonerName, summonerLevel }) {
    await this.summonerRepository.update(id, {
      Nickname: summonerName,
      SummonerLevel: summonerLevel,
    });
    const updatedSummoner = await this.summonerRepository.findOne({ id });

    return updatedSummoner;
  }

  async delete({ id }): Promise<string> {
    this.summonerRepository.delete({ id: id });
    return 'successfully deleted';
  }
}
