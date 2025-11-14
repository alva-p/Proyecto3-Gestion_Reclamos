import { Test, TestingModule } from '@nestjs/testing';
import { PermisosRepository } from './permisos.repository';

describe('PermisosRepository', () => {
  let provider: PermisosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermisosRepository],
    }).compile();

    provider = module.get<PermisosRepository>(PermisosRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
