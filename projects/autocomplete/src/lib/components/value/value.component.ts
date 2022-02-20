import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { MapEmit } from 'dist/selection-model';

import { SELECTION } from '../../tokens';
import { Option } from '../../types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueComponent<T extends boolean = false> {
  value!: Observable<string>;

  constructor(@Inject(SELECTION) private _selection: MapEmit<string, Option<string, unknown>, T>) {
    this.value = this._selection.changed.pipe(
      map(({ source: { selected } }) => {
        if (Array.isArray(selected)) {
          return selected.map(({ label }) => label).join(', ');
        }

        if (selected && selected.label) return selected.label;

        return '';
      }),
    );
  }

  @HostBinding('prevent-close') get preventClose(): boolean {
    return true;
  }

  removeTag(event: Event): void {
    event.stopPropagation();
  }
}
