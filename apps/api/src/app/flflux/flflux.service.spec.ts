import { Test, TestingModule } from '@nestjs/testing';
import { FlfluxService } from './flflux.service';

describe('FlfluxService', () => {
  let service: FlfluxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlfluxService],
    }).compile();

    service = module.get<FlfluxService>(FlfluxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
