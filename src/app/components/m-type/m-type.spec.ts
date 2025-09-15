import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MType } from './m-type';

describe('MType', () => {
  let component: MType;
  let fixture: ComponentFixture<MType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
