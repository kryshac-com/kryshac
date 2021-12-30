import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEmitComponent } from './map-emit.component';

describe('MapEmitComponent', () => {
  let component: MapEmitComponent;
  let fixture: ComponentFixture<MapEmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapEmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
