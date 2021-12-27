import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { Group, Option } from '../../types';

@Directive({
  selector: '[kcGroup]',
})
export class GroupDirective<T extends number | string> {
  constructor(
    public template: TemplateRef<unknown>,
    public viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  render(options: Option<T>[] | Group<T>) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
