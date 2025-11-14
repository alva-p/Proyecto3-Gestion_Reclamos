import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosRepository } from './proyectos.repository';

describe('ProyectosRepository', () => {
  let provider: ProyectosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectosRepository],
    }).compile();

    provider = module.get<ProyectosRepository>(ProyectosRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
