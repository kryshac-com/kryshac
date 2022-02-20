import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTypeComponent } from './options-type.component';

describe('OptionsTypeComponent', () => {
  let component: OptionsTypeComponent;
  let fixture: ComponentFixture<OptionsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
