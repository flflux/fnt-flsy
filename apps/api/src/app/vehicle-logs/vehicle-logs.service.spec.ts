import { Test, TestingModule } from '@nestjs/testing';
import { VehicleLogsService } from './vehicle-logs.service';

describe('VehicleLogsService', () => {
  let service: VehicleLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleLogsService],
    }).compile();

    service = module.get<VehicleLogsService>(VehicleLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
