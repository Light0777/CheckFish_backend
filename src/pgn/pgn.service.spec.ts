import { Test, TestingModule } from '@nestjs/testing';
import { PgnService } from './pgn.service';

describe('PgnService', () => {
  let service: PgnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgnService],
    }).compile();

    service = module.get<PgnService>(PgnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
