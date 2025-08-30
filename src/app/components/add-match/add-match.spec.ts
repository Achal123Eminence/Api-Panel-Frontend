import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatch } from './add-match';

describe('AddMatch', () => {
  let component: AddMatch;
  let fixture: ComponentFixture<AddMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
