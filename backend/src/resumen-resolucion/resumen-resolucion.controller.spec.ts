import { Test, TestingModule } from '@nestjs/testing';
import { ResumenResolucionController } from './resumen-resolucion.controller';

describe('ResumenResolucionController', () => {
  let controller: ResumenResolucionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumenResolucionController],
    }).compile();

    controller = module.get<ResumenResolucionController>(ResumenResolucionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
