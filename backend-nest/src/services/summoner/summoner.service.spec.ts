import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from './summoner.service';

describe('SummonerService', () => {
  let service: SummonerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummonerService],
    }).compile();

    service = module.get<SummonerService>(SummonerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
