import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-demo-autocomplete',
  templateUrl: './demo-autocomplete.component.html',
  styleUrls: ['./demo-autocomplete.component.scss']
})
export class DemoAutocompleteComponent {
  search = new FormControl();
  control = new FormControl('test');

  optionsTest = [
      {
        label: 'Test 1',
        value: 1
      },
      {
        label: 'Test 2',
        value: 2
      },
      {
        label: 'Test 3',
        value: 3
      }
    ]

  options = this.search.valueChanges.pipe(
    startWith(''),
    map((search) => this.optionsTest.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())))
  );

  constructor(private _cdr: ChangeDetectorRef) {}
}
