import { TestBed } from '@angular/core/testing';

import { ProfileredirectService } from './profileredirect.service';

describe('ProfileredirectService', () => {
  let service: ProfileredirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileredirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
