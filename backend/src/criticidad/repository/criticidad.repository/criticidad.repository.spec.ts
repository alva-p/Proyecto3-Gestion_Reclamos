import { Test, TestingModule } from '@nestjs/testing';
import { CriticidadRepository } from './criticidad.repository';

describe('CriticidadRepository', () => {
  let provider: CriticidadRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriticidadRepository],
    }).compile();

    provider = module.get<CriticidadRepository>(CriticidadRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
