import { Test, TestingModule } from '@nestjs/testing';
import { SubareasRepository } from './subareas.repository';

describe('SubareasRepository', () => {
  let provider: SubareasRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubareasRepository],
    }).compile();

    provider = module.get<SubareasRepository>(SubareasRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
