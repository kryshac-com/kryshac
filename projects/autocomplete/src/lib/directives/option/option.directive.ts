import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[kcOption]' })
export class KCOptionDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
