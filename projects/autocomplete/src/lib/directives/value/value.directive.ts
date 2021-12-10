import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[value]' })
export class ValueDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
