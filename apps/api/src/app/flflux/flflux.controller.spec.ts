import { Test, TestingModule } from '@nestjs/testing';
import { FlfluxController } from './flflux.controller';

describe('FlfluxController', () => {
  let controller: FlfluxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlfluxController],
    }).compile();

    controller = module.get<FlfluxController>(FlfluxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
