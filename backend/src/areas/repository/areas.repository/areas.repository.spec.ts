import { Test, TestingModule } from '@nestjs/testing';
import { AreasRepository } from './areas.repository';

describe('AreasRepository', () => {
  let provider: AreasRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasRepository],
    }).compile();

    provider = module.get<AreasRepository>(AreasRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
