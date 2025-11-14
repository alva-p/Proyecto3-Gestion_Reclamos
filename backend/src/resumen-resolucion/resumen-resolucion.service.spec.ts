import { Test, TestingModule } from '@nestjs/testing';
import { ResumenResolucionService } from './resumen-resolucion.service';

describe('ResumenResolucionService', () => {
  let service: ResumenResolucionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumenResolucionService],
    }).compile();

    service = module.get<ResumenResolucionService>(ResumenResolucionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
