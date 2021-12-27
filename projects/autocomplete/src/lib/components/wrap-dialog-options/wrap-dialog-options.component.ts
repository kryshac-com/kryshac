import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  QueryList,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { KCOptionsDirective } from '../../directives';

@Component({
  selector: 'kc-wrap-dialog-options',
  templateUrl: './wrap-dialog-options.component.html',
  styleUrls: ['./wrap-dialog-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapDialogOptionsComponent implements OnChanges {
  @Input() public optionsTemplate!: QueryList<KCOptionsDirective>;

  @Input() public options!: unknown;

  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  ngOnChanges(): void {
    this._outlet.clear();

    this.optionsTemplate.forEach((optionsTemplate) => {
      const dialog = optionsTemplate.template.createEmbeddedView({ $implicit: this.options });
      this._outlet.insert(dialog);
    });
  }
}
