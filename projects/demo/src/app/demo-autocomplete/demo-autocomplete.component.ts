import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'dist/autocomplete';
import { map, Observable, of, startWith, tap } from 'rxjs';

type Options  = Record<string, Option<Option<string>[]>>;

@Component({
  selector: 'app-demo-autocomplete',
  templateUrl: './demo-autocomplete.component.html',
  styleUrls: ['./demo-autocomplete.component.scss']
})
export class DemoAutocompleteComponent {
  search = new FormControl();
  control = new FormControl('test');

  simpleOptionsTest: Option[] = [
          {
            label: 'Location 1',
            value: 'Location 1'
          },
          {
            label: 'Location 2',
            value: 'Location 2'
          }
  ]

  optionsTest: Options = {
        locations: {
          label: 'Locations',
          value: [
          {
            label: 'Location 1',
            value: 'Location 1'
          },
          {
            label: 'Location 2',
            value: 'Location 2'
          }
        ],
      },
        waiters: {
          label: 'Waiters',
          value: [
          {
            label: 'Waiter 1',
            value: 'Waiter 1'
          },
          {
            label: 'Waiter 2',
            value: 'Waiter 2'
          }
        ]
      }

    };
// {
//         label: 'Test 2',
//         value: 2
//       },
//       {
//         label: 'Test 3',
//         value: 3
//       }

  simpleOptions = this.search.valueChanges.pipe(
    startWith(''),
    map((search) => this.simpleOptionsTest.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())))
  );

  options: Observable<Options> = this.search.valueChanges.pipe(
    startWith(''),
    map((search) => Object.entries(this.optionsTest).reduce<Options>((acc, [key, {label, value}]) => {
      acc[key] = {
        label,
        value: value.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
      }

      return acc;
    }, {})),
    tap((tapLog) => console.log(tapLog)),
  );

  constructor(private _cdr: ChangeDetectorRef) {}
}
