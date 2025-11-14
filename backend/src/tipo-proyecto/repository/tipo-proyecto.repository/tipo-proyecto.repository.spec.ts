import { Test, TestingModule } from '@nestjs/testing';
import { TipoProyectoRepository } from './tipo-proyecto.repository';

describe('TipoProyectoRepository', () => {
  let provider: TipoProyectoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoProyectoRepository],
    }).compile();

    provider = module.get<TipoProyectoRepository>(TipoProyectoRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
