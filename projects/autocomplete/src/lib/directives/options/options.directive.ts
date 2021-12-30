import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { Option } from '../../types';

@Directive({ selector: '[kcOptions]' })
export class KCOptionsDirective<T extends number | string> {
  constructor(
    private _template: TemplateRef<unknown>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  render(options: Option<T>[]) {
    console.log('render options', options);
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
