import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'wrapped-form-control',
    loadChildren: () => import('./wrapped-form-control').then(m => m.WrappedFormControlModule),
  },
  {
    path: 'autocomplete',
    loadChildren: () => import('./demo-autocomplete').then(m => m.DemoAutocompleteModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
