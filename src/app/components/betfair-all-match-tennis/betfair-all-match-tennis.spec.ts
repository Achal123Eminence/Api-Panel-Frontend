import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetfairAllMatchTennis } from './betfair-all-match-tennis';

describe('BetfairAllMatchTennis', () => {
  let component: BetfairAllMatchTennis;
  let fixture: ComponentFixture<BetfairAllMatchTennis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetfairAllMatchTennis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetfairAllMatchTennis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
