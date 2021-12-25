import { SelectionModel } from '@angular/cdk/collections';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SELECTION } from '../../tokens';

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

  @HostBinding('prevent-close') get preventClose(): boolean {
    return true;
  }

  ngOnInit(): void {
  }

  removeTag(event: Event): void {
    event.stopPropagation();
  }
}
