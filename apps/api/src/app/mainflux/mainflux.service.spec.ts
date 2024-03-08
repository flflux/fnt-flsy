import { Test, TestingModule } from '@nestjs/testing';
import { MainfluxService } from './mainflux.service';

describe('MainfluxService', () => {
  let service: MainfluxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainfluxService],
    }).compile();

    service = module.get<MainfluxService>(MainfluxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
