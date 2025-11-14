import { Test, TestingModule } from '@nestjs/testing';
import { ReclamosRepository } from './reclamos.repository';

describe('ReclamosRepository', () => {
  let provider: ReclamosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReclamosRepository],
    }).compile();

    provider = module.get<ReclamosRepository>(ReclamosRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
