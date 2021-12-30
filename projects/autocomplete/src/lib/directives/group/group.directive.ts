import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { Group, Option } from '../../types';

@Directive({
  selector: '[kcGroup]',
})
export class GroupDirective<T extends number | string> {
  constructor(
    private _template: TemplateRef<unknown>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  render(options: Option<T>[] | Option<T>[][] | Group<T>) {
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
