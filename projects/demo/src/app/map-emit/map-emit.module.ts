import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MapEmitRoutingModule } from './map-emit-routing.module';
import { MapEmitComponent } from './map-emit.component';

@NgModule({
  declarations: [MapEmitComponent],
  imports: [CommonModule, MapEmitRoutingModule],
})
export class MapEmitModule {}
