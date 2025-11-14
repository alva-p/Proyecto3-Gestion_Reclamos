import { Test, TestingModule } from '@nestjs/testing';
import { HistorialReclamoRepository } from './historial-reclamo.repository';

describe('HistorialReclamoRepository', () => {
  let provider: HistorialReclamoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialReclamoRepository],
    }).compile();

    provider = module.get<HistorialReclamoRepository>(HistorialReclamoRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
