import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { SELECTION } from '../../tokens';
import { Option } from '../../types';

@Component({
  selector: 'kc-option',
  templateUrl: './kc-option.component.html',
  styleUrls: ['./kc-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KCOptionComponent implements OnDestroy {
  @Input() option!: Option;

  private _destroy: Subject<void>;

  constructor(@Inject(SELECTION) private _selection: SelectionModel<unknown>, private _cdr: ChangeDetectorRef) {
    this._destroy = new Subject();

    this._selection.changed.pipe(takeUntil(this._destroy)).subscribe(() => this._cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  get selected(): boolean {
    return this._selection.isSelected(this.option);
  }

  click(): void {
    if (this._selection.isSelected(this.option)) this._selection.deselect(this.option);
    else this._selection.select(this.option);
  }
}
