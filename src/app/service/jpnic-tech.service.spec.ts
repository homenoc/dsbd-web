import { TestBed } from '@angular/core/testing';

import { JpnicTechService } from './jpnic-tech.service';

describe('JpnicTechService', () => {
  let service: JpnicTechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JpnicTechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
