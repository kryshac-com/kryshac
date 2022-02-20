import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedMultipleComponent } from './nested-multiple.component';

describe('NestedMultipleComponent', () => {
  let component: NestedMultipleComponent;
  let fixture: ComponentFixture<NestedMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NestedMultipleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
