import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SELECTION } from '../../tokens';

@Component({
  selector: 'kc-option',
  templateUrl: './kc-option.component.html',
  styleUrls: ['./kc-option.component.scss']
})
export class KCOptionComponent implements OnInit {
  @Input() option!: any;

  constructor(
    @Inject(SELECTION) private _selection: SelectionModel<unknown>,
  ) { }

  get selected(): boolean {
    return this._selection.isSelected(this.option);
  }

  ngOnInit(): void {
    console.log('option', this.option);
  }

  click(): void {
    if (this._selection.isSelected(this.option))
      this._selection.deselect(this.option);
    else
      this._selection.select(this.option);
  }
}
