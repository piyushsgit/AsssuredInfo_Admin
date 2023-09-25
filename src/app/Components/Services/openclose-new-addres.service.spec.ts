import { TestBed } from '@angular/core/testing';

import { OpencloseNewAddresService } from './openclose-new-addres.service';

describe('OpencloseNewAddresService', () => {
  let service: OpencloseNewAddresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpencloseNewAddresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
