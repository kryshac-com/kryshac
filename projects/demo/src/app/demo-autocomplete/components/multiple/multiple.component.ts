import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Option } from '@kryshac/autocomplete';

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleComponent implements OnInit {
  @Input() group!: FormGroup;

  control: FormControl;
  options: Option<string, string>[];

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control(['Location 2']);

    this.options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
    ];
  }

  ngOnInit(): void {
    this.group.addControl('multiple', this.control);
  }
}
