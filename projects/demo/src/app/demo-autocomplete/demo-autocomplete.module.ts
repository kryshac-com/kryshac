import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoAutocompleteRoutingModule } from './demo-autocomplete-routing.module';
import { DemoAutocompleteComponent } from './demo-autocomplete.component';
import { AutocompleteModule } from '@kryshac/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DemoAutocompleteComponent
  ],
  imports: [
    CommonModule,
    DemoAutocompleteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteModule,
  ]
})
export class DemoAutocompleteModule { }
