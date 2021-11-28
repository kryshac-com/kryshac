import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
  exports: [
    AutocompleteComponent
  ]
})
export class AutocompleteModule { }
