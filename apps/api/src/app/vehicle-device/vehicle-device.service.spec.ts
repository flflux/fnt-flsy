import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDeviceService } from './vehicle-device.service';

describe('VehicleDeviceService', () => {
  let service: VehicleDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleDeviceService],
    }).compile();

    service = module.get<VehicleDeviceService>(VehicleDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
