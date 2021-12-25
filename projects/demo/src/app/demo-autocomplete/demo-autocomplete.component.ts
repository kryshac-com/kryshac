/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

import { Option, OptionGroup, OptionObject } from 'dist/autocomplete';

@Component({
  selector: 'app-demo-autocomplete',
  templateUrl: './demo-autocomplete.component.html',
  styleUrls: ['./demo-autocomplete.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoAutocompleteComponent {
  search = new FormControl();
  control = new FormControl();

  simpleOptionsTest: Option[] = [
    {
      key: 'location 1',
      label: 'Location 1',
      value: 'Location 1',
    },
    {
      key: 'location 2',
      label: 'Location 2',
      value: 'Location 2',
    },
  ];

  optionsTest: OptionGroup = {
    locations: {
      label: 'Locations',
      value: [
        {
          key: 'location 1',
          label: 'Location 1',
          value: 'Location 1',
        },
        {
          key: 'location 2',
          label: 'Location 2',
          value: 'Location 2',
        },
      ],
    },
    waiters: {
      label: 'Waiters',
      value: [
        {
          key: 'waiter 1',
          label: 'Waiter 1',
          value: 'Waiter 1',
        },
        {
          key: 'waiter 2',
          label: 'Waiter 2',
          value: 'Waiter 2',
        },
      ],
    },
  };

  optionsNested: OptionGroup = {
    locations: {
      label: 'Locations',
      value: [
        {
          key: 'location 1',
          label: 'Location 1',
          value: 'Location 1',
        },
        {
          key: 'location 2',
          label: 'Location 2',
          value: 'Location 2',
        },
      ],
    },
    waiters: {
      users: {
        label: 'Users',
        value: [
          {
            key: 'waiter 1',
            label: 'Waiter 1',
            value: 'Waiter 1',
          },
          {
            key: 'waiter 2',
            label: 'Waiter 2',
            value: 'Waiter 2',
          },
        ],
      },
      things: {
        label: 'Things',
        value: [
          {
            key: 'thing 1',
            label: 'Thing 1',
            value: 'Thing 1',
          },
        ],
      },
    },
  };

  simpleOptions = this.search.valueChanges.pipe(
    startWith<string>(''),
    map((search) =>
      this.simpleOptionsTest.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase())),
    ),
  );

  options: Observable<OptionGroup> = this.search.valueChanges.pipe(
    startWith<string>(''),
    map((search) => this._filterNestedOptions(this.optionsNested, search)),
    // map((search) =>
    //   Object.entries(this.optionsTest).reduce<OptionGroup>((acc, [key, { label, value }]) => {
    //     acc[key] = {
    //       label,
    //       value: value.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase())),
    //     };

    //     return acc;
    //   }, {}),
    // ),
  );

  optionsNested$: Observable<any> = this.search.valueChanges.pipe(
    startWith<string>(''),
    map((search) => this._filterNestedOptions(this.optionsNested, search)),
    // tap((tapLog) => console.log(tapLog)),
  );

  constructor(private _cdr: ChangeDetectorRef) {}

  private _filterNestedOptions(options: Option[], search: string): Option[];
  private _filterNestedOptions(options: OptionGroup, search: string): OptionGroup;
  private _filterNestedOptions(options: Option[] | OptionGroup, search: string): Option[] | OptionGroup {
    if (Array.isArray(options))
      return options.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase()));
    else {
      return Object.entries(options).reduce<OptionGroup>((acc, [key, items]) => {
        if (Array.isArray(items)) acc[key] = this._filterNestedOptions(items, search);
        else if (this._isOptionObject(items)) {
          const { value, ...rest } = items;
          acc[key] = {
            ...rest,
            value: this._filterNestedOptions(value, search),
          } as OptionObject;
        } else {
          acc[key] = this._filterNestedOptions(items, search);
        }

        return acc;
      }, {});
    }
  }

  private _isOptionObject(option: OptionGroup | OptionObject): option is OptionObject {
    return option.hasOwnProperty('value');
  }
}

// {
//   key: 'location 1',
//   label: 'Location 1',
//   value: 'Location 1',
// },
// {
//   key: 'location 2',
//   label: 'Location 2',
//   value: 'Location 2',
// },

// waiters: {
//   users: {
//     label: 'Users',
//     value: [
//       {
//         key: 'waiter 1',
//         label: 'Waiter 1',
//         value: 'Waiter 1',
//       },
//       {
//         key: 'waiter 2',
//         label: 'Waiter 2',
//         value: 'Waiter 2',
//       },
//     ],
//   },
//   things: {
//     label: 'Things',
//     value: [
//       {
//         key: 'thing 1',
//         label: 'Thing 1',
//         value: 'Thing 1',
//       },
//     ],
//   },
// },
