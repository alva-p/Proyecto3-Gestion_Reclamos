import { Test, TestingModule } from '@nestjs/testing';
import { TipoProyectoController } from './tipo-proyecto.controller';

describe('TipoProyectoController', () => {
  let controller: TipoProyectoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoProyectoController],
    }).compile();

    controller = module.get<TipoProyectoController>(TipoProyectoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
