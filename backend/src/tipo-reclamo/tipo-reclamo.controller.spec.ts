import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoController } from './tipo-reclamo.controller';

describe('TipoReclamoController', () => {
  let controller: TipoReclamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoReclamoController],
    }).compile();

    controller = module.get<TipoReclamoController>(TipoReclamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
