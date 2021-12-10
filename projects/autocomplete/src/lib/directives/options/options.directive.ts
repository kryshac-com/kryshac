import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[kcOptions]' })
export class KCOptionsDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
