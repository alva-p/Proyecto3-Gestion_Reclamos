import { Test, TestingModule } from '@nestjs/testing';
import { SubareasController } from './subareas.controller';

describe('SubareasController', () => {
  let controller: SubareasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubareasController],
    }).compile();

    controller = module.get<SubareasController>(SubareasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
