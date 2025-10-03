import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningMatchMarket } from './running-match-market';

describe('RunningMatchMarket', () => {
  let component: RunningMatchMarket;
  let fixture: ComponentFixture<RunningMatchMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningMatchMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunningMatchMarket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
