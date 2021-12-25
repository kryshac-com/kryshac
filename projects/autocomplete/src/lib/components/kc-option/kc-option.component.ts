import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input } from '@angular/core';

import { SELECTION } from '../../tokens';

@Component({
  selector: 'kc-option',
  templateUrl: './kc-option.component.html',
  styleUrls: ['./kc-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KCOptionComponent {
  @Input() option!: any;

  constructor(@Inject(SELECTION) private _selection: SelectionModel<unknown>, private _cdr: ChangeDetectorRef) {
    this._selection.changed.subscribe(() => {
      this._cdr.detectChanges();
    });
  }

  get selected(): boolean {
    return this._selection.isSelected(this.option);
  }

  click(): void {
    if (this._selection.isSelected(this.option)) this._selection.deselect(this.option);
    else this._selection.select(this.option);
  }
}
