import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KCOptionComponent } from './kc-option.component';

describe('OptionComponent', () => {
  let component: KCOptionComponent;
  let fixture: ComponentFixture<KCOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KCOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KCOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
