import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { KCOptionDirective } from '../../directives';
import { Option } from '../../types';

@Component({
  selector: 'kc-options',
  templateUrl: './kc-options.component.html',
  styleUrls: ['./kc-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KCOptionsComponent<K, V> implements OnInit {
  @Input() public options!: Option<K, V>[];
  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ContentChild(KCOptionDirective, { static: true }) public optionTemplate!: KCOptionDirective<K, V>;
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  ngOnInit(): void {
    this._outlet.clear();

    this.options.forEach((option) => {
      const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
      this._outlet.insert(dialog);
    });
  }
}
