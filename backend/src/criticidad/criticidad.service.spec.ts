import { Test, TestingModule } from '@nestjs/testing';
import { CriticidadService } from './criticidad.service';

describe('CriticidadService', () => {
  let service: CriticidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriticidadService],
    }).compile();

    service = module.get<CriticidadService>(CriticidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
