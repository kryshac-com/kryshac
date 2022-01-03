import { Directive, Input, TemplateRef } from '@angular/core';

import { Option } from '../../types';

type Context<K, V> = { $implicit: Option<K, V> };

@Directive({ selector: '[kcOption]' })
export class KCOptionDirective<K, V> {
  @Input('kcOptionType') public type!: Option<K, V>;

  constructor(public template: TemplateRef<Context<K, V>>) {}

  static ngTemplateContextGuard<K, V>(_dir: KCOptionDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }
}
