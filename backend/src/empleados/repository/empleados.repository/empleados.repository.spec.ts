import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadosRepository } from './empleados.repository';

describe('EmpleadosRepository', () => {
  let provider: EmpleadosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpleadosRepository],
    }).compile();

    provider = module.get<EmpleadosRepository>(EmpleadosRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
