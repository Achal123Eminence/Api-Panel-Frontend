import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitSettings } from './limit-settings';

describe('LimitSettings', () => {
  let component: LimitSettings;
  let fixture: ComponentFixture<LimitSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
