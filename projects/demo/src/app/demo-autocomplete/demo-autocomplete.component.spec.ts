import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAutocompleteComponent } from './demo-autocomplete.component';

describe('DemoAutocompleteComponent', () => {
  let component: DemoAutocompleteComponent;
  let fixture: ComponentFixture<DemoAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
