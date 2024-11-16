import { TestBed } from '@angular/core/testing';

import { PokerHubConnectionService } from './poker-hub-connection.service';

describe('PokerHubConnectionService', () => {
  let service: PokerHubConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokerHubConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
