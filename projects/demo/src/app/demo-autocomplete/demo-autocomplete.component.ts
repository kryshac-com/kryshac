/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

import { Group, Option, OptionGroup } from 'dist/autocomplete';

@Component({
  selector: 'app-demo-autocomplete',
  templateUrl: './demo-autocomplete.component.html',
  styleUrls: ['./demo-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DemoAutocompleteComponent {
  search = new FormControl();
  control = new FormControl({
    locations: ['Location 1'],
    waiters: {
      users: ['Waiter 3'],
    },
  });

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

  optionsTest: Group = {
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

  optionsNested: Group = {
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
          [
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
          [
            {
              key: 'waiter 3',
              label: 'Waiter 3',
              value: 'Waiter 3',
            },
            {
              key: 'waiter 4',
              label: 'Waiter 4',
              value: 'Waiter 4',
            },
          ],
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

  options: Observable<Group> = this.search.valueChanges.pipe(
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

  private _filterNestedOptions(options: Option[], search: string): Option[];
  private _filterNestedOptions(options: Option[][], search: string): Option[][];
  private _filterNestedOptions(options: Group, search: string): Group;
  private _filterNestedOptions(options: Option[] | Option[][] | Group, search: string): Option[] | Option[][] | Group {
    if (this._isOptionChunks(options)) return options.map((option) => this._filterNestedOptions(option, search));
    else if (Array.isArray(options))
      return options.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase()));
    else {
      return Object.entries(options).reduce<Group>((acc, [key, item]) => {
        if (this._isOptionObject(item))
          acc[key] = {
            ...item,
            value: this._isOptionChunks(item.value)
              ? this._filterNestedOptions(item.value, search)
              : this._filterNestedOptions(item.value, search),
          };
        else acc[key] = this._filterNestedOptions(item, search);

        return acc;
      }, {});
    }
  }

  private _isOptionChunks(option: Option[] | Option[][] | Group): option is Option[][] {
    return Array.isArray(option) && Array.isArray(option[0]);
  }

  private _isOptionObject(option: Group | OptionGroup): option is OptionGroup {
    return !!option.value;
  }
}
