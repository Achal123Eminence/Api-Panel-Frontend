import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetition } from './add-competition';

describe('AddCompetition', () => {
  let component: AddCompetition;
  let fixture: ComponentFixture<AddCompetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompetition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompetition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
