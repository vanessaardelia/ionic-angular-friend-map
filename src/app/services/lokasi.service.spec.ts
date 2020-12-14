import { TestBed } from '@angular/core/testing';

import { LokasiService } from './lokasi.service';

describe('LokasiService', () => {
  let service: LokasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LokasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
