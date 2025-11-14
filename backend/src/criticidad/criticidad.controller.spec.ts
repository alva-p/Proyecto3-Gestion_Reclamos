import { Test, TestingModule } from '@nestjs/testing';
import { CriticidadController } from './criticidad.controller';

describe('CriticidadController', () => {
  let controller: CriticidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriticidadController],
    }).compile();

    controller = module.get<CriticidadController>(CriticidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
