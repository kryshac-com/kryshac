import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapEmitComponent } from './map-emit.component';

const routes: Routes = [
  {
    path: '',
    component: MapEmitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapEmitRoutingModule {}
