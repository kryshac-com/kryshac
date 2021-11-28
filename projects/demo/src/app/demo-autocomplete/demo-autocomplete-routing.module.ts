import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoAutocompleteComponent } from './demo-autocomplete.component';

const routes: Routes = [
  {
    path: '',
    component: DemoAutocompleteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoAutocompleteRoutingModule { }
