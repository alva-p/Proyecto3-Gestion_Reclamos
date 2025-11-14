import { Test, TestingModule } from '@nestjs/testing';
import { PrioridadRepository } from './prioridad.repository';

describe('PrioridadRepository', () => {
  let provider: PrioridadRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrioridadRepository],
    }).compile();

    provider = module.get<PrioridadRepository>(PrioridadRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
