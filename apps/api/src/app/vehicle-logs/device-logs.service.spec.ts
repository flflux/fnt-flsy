import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLogsService } from './device-logs.service';

describe('VehicleLogsService', () => {
  let service: DeviceLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceLogsService],
    }).compile();

    service = module.get<DeviceLogsService>(DeviceLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
