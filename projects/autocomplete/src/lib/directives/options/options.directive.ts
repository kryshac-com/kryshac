import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Option } from '../../types';

type Context<K, V> = { $implicit: Option<K, V>[] };

@Directive({ selector: '[kcOptions]' })
export class KCOptionsDirective<K, V> {
  @Input('kcOptionsType') public type!: Option<K, V>;

  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: KCOptionsDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: Option<K, V>[]) {
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
