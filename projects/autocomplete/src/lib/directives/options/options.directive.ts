import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[kcOptions]' })
export class KCOptionsDirective {
  constructor(public template: TemplateRef<unknown>, private viewContainer: ViewContainerRef) {
    // this.viewContainer.createEmbeddedView(this.template);
  }
}
