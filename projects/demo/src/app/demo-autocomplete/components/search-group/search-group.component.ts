import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Option, filterNestedOptions } from '@kryshac/autocomplete';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.component.html',
  styleUrls: ['./search-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchGroupComponent implements OnInit {
  @Input() group!: FormGroup;

  control: FormControl;
  search: FormControl;
  options: Option<string, string>[][];

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef) {
    this.control = this._fb.control('Location 1');
    this.search = this._fb.control('');

    const options = [
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

    this.options = options;

    this.search.valueChanges.subscribe((keyword: string) => {
      this.options = filterNestedOptions(options, keyword);
      this._cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.group.addControl('searchGroup', this.control);
  }
}
