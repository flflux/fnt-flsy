import { Test, TestingModule } from '@nestjs/testing';
import { VehicleLogsController } from './vehicle-logs.controller';

describe('VehicleLogsController', () => {
  let controller: VehicleLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleLogsController],
    }).compile();

    controller = module.get<VehicleLogsController>(VehicleLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
