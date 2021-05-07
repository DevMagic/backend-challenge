import { Test, TestingModule } from '@nestjs/testing';
import { SummonerController } from './summoner.controller';

describe('SummonerController', () => {
  let controller: SummonerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummonerController],
    }).compile();

    controller = module.get<SummonerController>(SummonerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
