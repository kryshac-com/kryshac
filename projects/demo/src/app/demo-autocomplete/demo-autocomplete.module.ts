import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutocompleteModule } from '@kryshac/autocomplete';

import { DemoAutocompleteRoutingModule } from './demo-autocomplete-routing.module';
import { DemoAutocompleteComponent } from './demo-autocomplete.component';

@NgModule({
  declarations: [DemoAutocompleteComponent],
  imports: [CommonModule, DemoAutocompleteRoutingModule, FormsModule, ReactiveFormsModule, AutocompleteModule],
})
export class DemoAutocompleteModule {}
