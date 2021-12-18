import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsGroupComponent } from './options-group.component';

describe('OptionsGroupComponent', () => {
  let component: OptionsGroupComponent;
  let fixture: ComponentFixture<OptionsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
