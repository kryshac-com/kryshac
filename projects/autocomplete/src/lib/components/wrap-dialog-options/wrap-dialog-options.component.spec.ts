import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapDialogOptionsComponent } from './wrap-dialog-options.component';

describe('WrapDialogOptionsComponent', () => {
  let component: WrapDialogOptionsComponent;
  let fixture: ComponentFixture<WrapDialogOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapDialogOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapDialogOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
