import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MapEmit } from 'dist/selection-model';

@Component({
  selector: 'app-map-emit',
  templateUrl: './map-emit.component.html',
  styleUrls: ['./map-emit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEmitComponent {
  constructor() {
    const test = new MapEmit<string, string, true>(true);

    test.changed.subscribe((value) => console.log(value));

    test.set('key', 'value');
    // test.select(['key', 'value'], ['value', 'key']);
    test.delete('key');
    test.set([['key', 'value']]);

    test.changed.subscribe(({ added }) => {
      if (added) {
        console.log('added', added);
        const [key, value] = added;
        console.log('key', key);
        console.log('value', value);
      }
    });
  }
}
