import { Test, TestingModule } from '@nestjs/testing';
import { HistorialReclamoService } from './historial-reclamo.service';

describe('HistorialReclamoService', () => {
  let service: HistorialReclamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialReclamoService],
    }).compile();

    service = module.get<HistorialReclamoService>(HistorialReclamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
