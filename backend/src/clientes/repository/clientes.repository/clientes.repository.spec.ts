import { Test, TestingModule } from '@nestjs/testing';
import { ClientesRepository } from './clientes.repository';

describe('ClientesRepository', () => {
  let provider: ClientesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientesRepository],
    }).compile();

    provider = module.get<ClientesRepository>(ClientesRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
