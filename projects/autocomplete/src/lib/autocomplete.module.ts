import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutocompleteComponent } from './autocomplete.component';
import { GroupComponent, KCOptionComponent, KCOptionsComponent, ValueComponent } from './components';
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
    GroupDirective,
    GroupComponent,
  ],
})
export class AutocompleteModule {}
