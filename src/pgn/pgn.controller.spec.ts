import { Test, TestingModule } from '@nestjs/testing';
import { PgnController } from './pgn.controller';

describe('PgnController', () => {
  let controller: PgnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PgnController],
    }).compile();

    controller = module.get<PgnController>(PgnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
