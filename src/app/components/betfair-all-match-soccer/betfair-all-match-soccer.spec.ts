import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetfairAllMatchSoccer } from './betfair-all-match-soccer';

describe('BetfairAllMatchSoccer', () => {
  let component: BetfairAllMatchSoccer;
  let fixture: ComponentFixture<BetfairAllMatchSoccer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetfairAllMatchSoccer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetfairAllMatchSoccer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
