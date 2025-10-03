import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerMatches } from './runner-matches';

describe('RunnerMatches', () => {
  let component: RunnerMatches;
  let fixture: ComponentFixture<RunnerMatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunnerMatches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunnerMatches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
