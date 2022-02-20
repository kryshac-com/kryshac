import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Option } from '@kryshac/autocomplete';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleComponent implements OnInit {
  @Input() group!: FormGroup;

  control: FormControl;
  options: Option<string, string>[];

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control('Location 1');

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
    this.group.addControl('simple', this.control);
  }
}
