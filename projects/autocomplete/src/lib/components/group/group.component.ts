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
import { SELECTION, VALUE } from '../../tokens';
import { Group, Option, OptionGroup, OptionGroupValue, OptionSelection, OptionValue } from '../../types';

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
    {
      provide: VALUE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (component: GroupComponent<any>) => component.value,
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

  selectionModel!: SelectionModel<Option<T> | OptionSelection<T>>;

  constructor(
    @SkipSelf() @Inject(SELECTION) private _selection: SelectionModel<Option<T> | OptionSelection<T>>,
    @SkipSelf() @Inject(VALUE) private _value: OptionValue<T> | OptionGroupValue<T>,
  ) {}

  get value(): OptionValue<T> | OptionGroupValue<T> {
    if (Array.isArray(this._value)) return this._value;

    return this._value[this.key];
  }

  ngAfterContentInit(): void {
    this.groups.forEach((group) => group.render(this._getGroup(this.options)));
    this.option.forEach((group, index) => group.render(this._getOptions(this.options)[index]));
  }

  ngOnInit(): void {
    this._initSelection();
  }

  private _initSelection(): void {
    const option = this._getOption();
    this.selectionModel = new SelectionModel<Option<T> | OptionSelection<T>>(option, this.multiple);

    this._selection.select({
      key: this.key,
      value: this.selectionModel,
    });

    this.selectionModel.changed.subscribe(() => {
      if (this._selection.isSelected({ key: this.key, value: [] as unknown as T })) {
        this._selection.update();
      } else {
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
      }
    });
  }

  private _getOption(): Option<T>[] | undefined {
    if (this._isOptionGroup(this.options[this.key]))
      return this._getOptions(this.options)
        .flat()
        .filter((option) => (this.value as OptionValue<T>).some((value) => value === option.value));

    return undefined;
  }

  private _getGroup(options: Group<T>): Group<T> {
    return options[this.key] as Group<T>;
  }

  private _getOptionGroup(options: Group<T>): OptionGroup<T> {
    return options[this.key] as OptionGroup<T>;
  }

  private _getOptions(options: Group<T>): Option<T>[][] {
    const value = this._getOptionGroup(options).value;

    if (this._isOptionChunks(value)) return value;

    return [value];
  }

  private _isOptionGroup(option: Group<T> | OptionGroup<T>): option is OptionGroup<T> {
    return !!option.value;
  }

  private _isOptionChunks(option: Option<T>[] | Option<T>[][]): option is Option<T>[][] {
    return Array.isArray(option[0]);
  }
}
