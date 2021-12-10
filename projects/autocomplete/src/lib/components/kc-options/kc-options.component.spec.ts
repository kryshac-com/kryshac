import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KCOptionsComponent } from './kc-options.component';

describe('DialogOptionsComponent', () => {
  let component: KCOptionsComponent;
  let fixture: ComponentFixture<KCOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KCOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KCOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
