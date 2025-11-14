import { Test, TestingModule } from '@nestjs/testing';
import { ResumenResolucionRepository } from './resumen-resolucion.repository';

describe('ResumenResolucionRepository', () => {
  let provider: ResumenResolucionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumenResolucionRepository],
    }).compile();

    provider = module.get<ResumenResolucionRepository>(ResumenResolucionRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
