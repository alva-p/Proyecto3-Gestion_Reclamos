import { Test, TestingModule } from '@nestjs/testing';
import { EstadoSolicitudRepository } from './estado-solicitud.repository';

describe('EstadoSolicitudRepository', () => {
  let provider: EstadoSolicitudRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoSolicitudRepository],
    }).compile();

    provider = module.get<EstadoSolicitudRepository>(EstadoSolicitudRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
