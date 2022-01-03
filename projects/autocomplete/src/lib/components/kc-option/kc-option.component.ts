import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MapEmit } from 'dist/selection-model';

import { SELECTION } from '../../tokens';
import { Option } from '../../types';

@Component({
  selector: 'kc-option',
  templateUrl: './kc-option.component.html',
  styleUrls: ['./kc-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KCOptionComponent<K, V> implements OnDestroy {
  @Input() option!: Option<K | V, V>;

  private _destroy: Subject<void>;

  constructor(
    @Inject(SELECTION) private _selection: MapEmit<K | V, Option<K | V, V>, boolean>,
    private _cdr: ChangeDetectorRef,
  ) {
    this._destroy = new Subject();

    this._selection.changed.pipe(takeUntil(this._destroy)).subscribe(() => this._cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  get selected(): boolean {
    return this._selection.has(this.option.key || this.option.value);
  }

  click(): void {
    if (this._selection.has(this.option.key || this.option.value))
      this._selection.delete(this.option.key || this.option.value);
    else this._selection.set(this.option.key || this.option.value, this.option);
  }
}
