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

import { MapEmit } from 'dist/selection-model';

import { GroupDirective, KCOptionsDirective } from '../../directives';
import { SELECTION, VALUE } from '../../tokens';
import { Group, Option, OptionGroup, OptionGroupValue, OptionSelection, OptionValue } from '../../types';

@Component({
  selector: 'kc-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  providers: [
    {
      provide: SELECTION,
      useFactory: (autocomplete: GroupComponent<unknown, unknown>) => autocomplete.selection.value,
      deps: [forwardRef(() => GroupComponent)],
    },
    {
      provide: VALUE,
      useFactory: (component: GroupComponent<unknown, unknown>) => component.value,
      deps: [forwardRef(() => GroupComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent<K, V> implements OnInit, AfterContentInit {
  @Input() options!: Group<K, V>;
  @Input() key!: string;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @ContentChildren(GroupDirective) groups!: QueryList<GroupDirective<K, V>>;
  @ContentChildren(KCOptionsDirective) option!: QueryList<KCOptionsDirective<K, V>>;

  selection!: {
    key: string;
    value: MapEmit<string, Option<K, V> | OptionSelection<K, V>, boolean>;
  };

  constructor(
    @SkipSelf()
    @Inject(SELECTION)
    private _selection: MapEmit<string, OptionSelection<K, V>, boolean>,
    @SkipSelf() @Inject(VALUE) private _value: OptionValue<V> | OptionGroupValue<V>,
  ) {}

  get value(): OptionValue<V> | OptionGroupValue<V> {
    if (this._isOptionGroupValue(this._value)) return this._value[this.key];

    return this.value;
  }

  ngAfterContentInit(): void {
    this.groups.forEach((group) => group.render(this._getGroup(this.options)));
    this.option.forEach((group, index) => group.render(this._getOptions(this.options)[index]));
  }

  ngOnInit(): void {
    this._initSelection();
  }

  private _initSelection(): void {
    this.selection = this._getSelection();

    this._selection.set(this.key, this.selection);

    this.selection.value.changed.subscribe(() => {
      if (this._selection.has(this.key)) {
        this._selection.update(this.key, this.selection);
      } else {
        this._selection.set(this.key, this.selection);
      }
    });
  }

  private _getSelection(): { key: string; value: MapEmit<string, Option<K, V> | OptionSelection<K, V>, boolean> } {
    if (this._selection.has(this.key)) return this._selection.get(this.key)!;

    const option = this._getOption();
    const options = option && (this.multiple ? option : option[0]);

    const value = new MapEmit<string, Option<K, V> | OptionSelection<K, V>, boolean>(this.multiple, options);

    return {
      key: this.key,
      value,
    };
  }

  private _getOption(): [string, Option<K, V>][] | undefined {
    if (this._isOptionGroup(this.options[this.key]))
      return this._getOptions(this.options)
        .flat()
        .filter((option) => {
          if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

          return this.value === option.value;
        })
        .map((option) => [(option.key || option.value) as unknown as string, option]);

    return undefined;
  }

  private _getGroup(options: Group<K, V>): Group<K, V> {
    return options[this.key] as Group<K, V>;
  }

  private _getOptionGroup(options: Group<K, V>): OptionGroup<K, V> {
    return options[this.key] as OptionGroup<K, V>;
  }

  private _getOptions(options: Group<K, V>): Option<K, V>[][] {
    const value = this._getOptionGroup(options).value;

    if (this._isOptionChunks(value)) return value;

    return [value];
  }

  private _isOptionGroup(option: Group<K, V> | OptionGroup<K, V>): option is OptionGroup<K, V> {
    return !!option.value;
  }

  private _isOptionGroupValue(value: OptionValue<V> | OptionGroupValue<V>): value is OptionGroupValue<V> {
    return typeof value === 'object' && !Array.isArray(value);
  }

  private _isOptionChunks(option: Option<K, V>[] | Option<K, V>[][]): option is Option<K, V>[][] {
    return Array.isArray(option[0]);
  }
}
