import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrappedFormControlComponent } from './wrapped-form-control.component';

const routes: Routes = [
  {
    path: '',
    component: WrappedFormControlComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrappedFormControlRoutingModule { }
