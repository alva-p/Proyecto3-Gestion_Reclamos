import { Test, TestingModule } from '@nestjs/testing';
import { EstadoReclamoRepository } from './estado-reclamo.repository';

describe('EstadoReclamoRepository', () => {
  let provider: EstadoReclamoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoReclamoRepository],
    }).compile();

    provider = module.get<EstadoReclamoRepository>(EstadoReclamoRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
