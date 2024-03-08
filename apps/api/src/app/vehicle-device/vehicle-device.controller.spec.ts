import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDeviceController } from './vehicle-device.controller';

describe('VehicleDeviceController', () => {
  let controller: VehicleDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleDeviceController],
    }).compile();

    controller = module.get<VehicleDeviceController>(VehicleDeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
