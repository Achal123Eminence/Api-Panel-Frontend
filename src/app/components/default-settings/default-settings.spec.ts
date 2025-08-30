import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSettings } from './default-settings';

describe('DefaultSettings', () => {
  let component: DefaultSettings;
  let fixture: ComponentFixture<DefaultSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
