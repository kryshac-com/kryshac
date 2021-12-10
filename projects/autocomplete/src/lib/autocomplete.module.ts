import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { KCOptionsComponent, KCOptionComponent, ValueComponent, WrapDialogOptionsComponent } from './components';
import { KCOptionsDirective, KCOptionDirective, ValueDirective } from './directives';

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
  ]
})
export class AutocompleteModule { }
