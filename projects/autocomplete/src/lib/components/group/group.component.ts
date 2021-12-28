import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  OnInit,
  QueryList,
  SkipSelf,
  forwardRef,
} from '@angular/core';

import { SelectionModel } from 'dist/selection-model';

import { GroupDirective, KCOptionsDirective } from '../../directives';
import { SELECTION } from '../../tokens';
import { Group, Option, OptionGroup } from '../../types';

@Component({
  selector: 'kc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [
    {
      provide: SELECTION,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (autocomplete: GroupComponent<any>) => autocomplete.selectionModel,
      deps: [forwardRef(() => GroupComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent<T extends number | string> implements OnInit, AfterContentInit {
  @Input() options!: Group<T>;
  @Input() key!: string;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @ContentChildren(GroupDirective) groups!: QueryList<GroupDirective<T>>;
  @ContentChildren(KCOptionsDirective) option!: QueryList<KCOptionsDirective<T>>;

  selectionModel!: SelectionModel<{ key: string; value: unknown }>;

  constructor(@SkipSelf() @Inject(SELECTION) private _selection: SelectionModel<{ key: string; value: unknown }>) {}

  ngAfterContentInit(): void {
    this.groups.forEach((group) => group.render(this._getGroup(this.options)));
    this.option.forEach((group) => group.render(this._getOptions(this.options)));
  }

  ngOnInit(): void {
    this.selectionModel = new SelectionModel(undefined, this.multiple);

    this._selection.select({
      key: this.key,
      value: this.selectionModel,
    });

    this.selectionModel.changed.subscribe(() => {
      if (this._selection.isSelected({ key: this.key, value: 'value' })) {
        this._selection.update();
      } else {
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
      }
    });
  }

  private _getGroup(options: Group<T>): Group<T> {
    return options[this.key] as Group<T>;
  }

  private _getOptionGroup(options: Group<T>): OptionGroup<T> {
    return options[this.key] as OptionGroup<T>;
  }

  private _getOptions(options: Group<T>): Option<T>[] {
    return this._getOptionGroup(options).value;
  }
}
