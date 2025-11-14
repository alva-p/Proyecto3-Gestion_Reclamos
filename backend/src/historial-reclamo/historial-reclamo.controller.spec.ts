import { Test, TestingModule } from '@nestjs/testing';
import { HistorialReclamoController } from './historial-reclamo.controller';

describe('HistorialReclamoController', () => {
  let controller: HistorialReclamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialReclamoController],
    }).compile();

    controller = module.get<HistorialReclamoController>(HistorialReclamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
