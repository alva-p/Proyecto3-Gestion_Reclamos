import { Test, TestingModule } from '@nestjs/testing';
import { EstadoReclamoController } from './estado-reclamo.controller';

describe('EstadoReclamoController', () => {
  let controller: EstadoReclamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoReclamoController],
    }).compile();

    controller = module.get<EstadoReclamoController>(EstadoReclamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
