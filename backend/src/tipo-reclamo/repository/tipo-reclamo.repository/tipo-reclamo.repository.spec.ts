import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoRepository } from './tipo-reclamo.repository';

describe('TipoReclamoRepository', () => {
  let provider: TipoReclamoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoReclamoRepository],
    }).compile();

    provider = module.get<TipoReclamoRepository>(TipoReclamoRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
