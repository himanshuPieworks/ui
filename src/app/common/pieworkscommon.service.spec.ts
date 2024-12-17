import { TestBed } from '@angular/core/testing';

import { PieworkscommonService } from './pieworkscommon.service';

describe('PieworkscommonService', () => {
  let service: PieworkscommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieworkscommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
