import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiamondSkyCricket } from './add-diamond-sky-cricket';

describe('AddDiamondSkyCricket', () => {
  let component: AddDiamondSkyCricket;
  let fixture: ComponentFixture<AddDiamondSkyCricket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiamondSkyCricket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDiamondSkyCricket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
