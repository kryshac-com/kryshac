import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrappedFormControlComponent } from './wrapped-form-control.component';

describe('WrappedFormControlComponent', () => {
  let component: WrappedFormControlComponent;
  let fixture: ComponentFixture<WrappedFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrappedFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrappedFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
