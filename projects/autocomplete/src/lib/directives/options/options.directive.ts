import { Directive, Inject, TemplateRef, ViewContainerRef } from '@angular/core';

import { OPTIONS, SELECTION } from '../../tokens';

@Directive({ selector: '[kcOptions]' })
export class KCOptionsDirective {
  constructor(
    public template: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    @Inject(OPTIONS) private _options: any,
    @Inject(SELECTION) private _selections: any,
  ) {
    this.viewContainer.createEmbeddedView(this.template);
  }
}
