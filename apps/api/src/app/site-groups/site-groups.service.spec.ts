import { Test, TestingModule } from '@nestjs/testing';
import { SiteGroupsService } from './site-groups.service';

describe('SiteGroupsService', () => {
  let service: SiteGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteGroupsService],
    }).compile();

    service = module.get<SiteGroupsService>(SiteGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
