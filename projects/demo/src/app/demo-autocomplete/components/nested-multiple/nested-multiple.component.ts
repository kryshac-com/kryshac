import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Group } from '@kryshac/autocomplete';

@Component({
  selector: 'app-nested-multiple',
  templateUrl: './nested-multiple.component.html',
  styleUrls: ['./nested-multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedMultipleComponent implements OnInit {
  @Input() group!: FormGroup;

  control: FormControl;
  options: Group<string, string>;

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control({
      locations: 'Location 1',
      waiters: {
        users: ['Waiter 1', 'Waiter 3'],
        things: 'Thing 1',
      },
    });

    this.options = {
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
  }

  ngOnInit(): void {
    this.group.addControl('nestedMultiple', this.control);
  }
}
