import { Component, Inject, Input, OnInit } from '@angular/core';
import { SELECTION } from '../../tokens';
import { SelectionModel } from '@angular/cdk/collections';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {
  value!: Observable<string>;


  constructor(
    @Inject(SELECTION) private _selection: SelectionModel<unknown>,
  ) {
    this.value = this._selection.changed.pipe(
      map((options) => (options.source.selected as {label: string}[]).map(({label}) => label).join(', '))
    );
  }

  ngOnInit(): void {
  }

  removeTag(event: Event): void {
    event.stopPropagation();
  }
}
