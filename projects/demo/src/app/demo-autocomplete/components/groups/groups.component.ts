import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Option } from '@kryshac/autocomplete';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {
  @Input() group!: FormGroup;

  control: FormControl;
  options: Option<string, string>[][];

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control('Location 1');

    this.options = [
      [
        {
          label: 'Location 1',
          value: 'Location 1',
        },
        {
          label: 'Location 2',
          value: 'Location 2',
        },
      ],
      [
        {
          label: 'Location 3',
          value: 'Location 3',
        },
        {
          label: 'Location 4',
          value: 'Location 4',
        },
      ],
    ];
  }

  ngOnInit(): void {
    this.group.addControl('groups', this.control);
  }

  get getType(): Option<string, string> {
    return null!;
  }
}
