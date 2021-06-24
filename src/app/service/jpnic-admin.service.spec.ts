import { TestBed } from '@angular/core/testing';

import { JpnicAdminService } from './jpnic-admin.service';

describe('JpnicAdminService', () => {
  let service: JpnicAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JpnicAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
