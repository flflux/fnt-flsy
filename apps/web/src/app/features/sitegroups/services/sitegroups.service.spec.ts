import { TestBed } from '@angular/core/testing';

import { SitegroupsService } from './sitegroups.service';

describe('SitegroupsService', () => {
  let service: SitegroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitegroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
