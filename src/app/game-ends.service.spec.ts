import { TestBed } from '@angular/core/testing';
import { GameEndsService } from './game-ends.service';

describe('GameEndsService', () => {
  let service: GameEndsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEndsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
