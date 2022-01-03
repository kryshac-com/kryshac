import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { Group, Option } from '../../types';

type Context<K, V> = { $implicit: Group<K, V> };

@Directive({
  selector: '[kcGroup]',
})
export class GroupDirective<K, V> {
  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: GroupDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: Option<K, V>[] | Option<K, V>[][] | Group<K, V>) {
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
