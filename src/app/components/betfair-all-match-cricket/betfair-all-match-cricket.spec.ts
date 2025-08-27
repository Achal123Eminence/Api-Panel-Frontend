import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetfairAllMatchCricket } from './betfair-all-match-cricket';

describe('BetfairAllMatchCricket', () => {
  let component: BetfairAllMatchCricket;
  let fixture: ComponentFixture<BetfairAllMatchCricket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetfairAllMatchCricket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetfairAllMatchCricket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
