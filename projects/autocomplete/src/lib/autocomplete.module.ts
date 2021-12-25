import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutocompleteComponent } from './autocomplete.component';
import { KCOptionComponent, KCOptionsComponent, OptionsGroupComponent, ValueComponent, WrapDialogOptionsComponent } from './components';
import { KCOptionDirective, KCOptionsDirective, ValueDirective } from './directives';

@NgModule({
  declarations: [
    AutocompleteComponent,
    ValueComponent,
    ValueDirective,
    KCOptionComponent,
    KCOptionDirective,
    KCOptionsComponent,
    KCOptionsDirective,
    WrapDialogOptionsComponent,
    OptionsGroupComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
  exports: [
    AutocompleteComponent,
    ValueComponent,
    ValueDirective,
    KCOptionComponent,
    KCOptionDirective,
    KCOptionsComponent,
    KCOptionsDirective,
OptionsGroupComponent,
  ]
})
export class AutocompleteModule { }
