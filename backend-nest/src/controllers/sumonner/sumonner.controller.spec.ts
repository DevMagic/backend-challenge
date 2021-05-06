import { Test, TestingModule } from '@nestjs/testing';
import { SumonnerController } from './sumonner.controller';

describe('SumonnerController', () => {
  let controller: SumonnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SumonnerController],
    }).compile();

    controller = module.get<SumonnerController>(SumonnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
