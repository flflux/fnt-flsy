import { Test, TestingModule } from '@nestjs/testing';
import { SiteGroupsController } from './site-groups.controller';

describe('SiteGroupsController', () => {
  let controller: SiteGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteGroupsController],
    }).compile();

    controller = module.get<SiteGroupsController>(SiteGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
