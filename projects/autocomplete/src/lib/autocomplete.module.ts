import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutocompleteComponent } from './autocomplete.component';
import {
  GroupComponent,
  KCOptionComponent,
  KCOptionsComponent,
  OptionsGroupComponent,
  ValueComponent,
  WrapDialogOptionsComponent,
} from './components';
import { GroupDirective, KCOptionDirective, KCOptionsDirective, ValueDirective } from './directives';

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
    GroupDirective,
    GroupComponent,
  ],
  imports: [CommonModule, OverlayModule],
  exports: [
    AutocompleteComponent,
    ValueComponent,
    ValueDirective,
    KCOptionComponent,
    KCOptionDirective,
    KCOptionsComponent,
    KCOptionsDirective,
    OptionsGroupComponent,
    GroupDirective,
    GroupComponent,
  ],
})
export class AutocompleteModule {}
