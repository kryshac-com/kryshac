import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, ReplaySubject, Subject, isObservable, takeUntil } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { MapEmit } from 'dist/selection-model';

import { GroupDirective, KCOptionsDirective, ValueDirective } from './directives';
import { getValues } from './helpers';
import { SELECTION, VALUE } from './tokens';
import { Group, Option, OptionGroupValue, OptionSelection, OptionValue } from './types';

@Component({
  selector: 'kc-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
    {
      provide: SELECTION,
      useFactory: (component: AutocompleteComponent<unknown, unknown>) => component.selection,
      deps: [forwardRef(() => AutocompleteComponent)],
    },
    {
      provide: VALUE,
      useFactory: (component: AutocompleteComponent<unknown, unknown>) => component.value,
      deps: [forwardRef(() => AutocompleteComponent)],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent<K, V> implements AfterContentInit, ControlValueAccessor {
  @Input()
  get options(): Observable<Option<K, V>[] | Option<K, V>[][] | Group<K, V>> {
    return this._options;
  }
  set options(
    options:
      | Observable<Option<K, V>[] | Option<K, V>[][] | Group<K, V>>
      | Option<K, V>[]
      | Option<K, V>[][]
      | Group<K, V>,
  ) {
    if (isObservable(options)) this._options = options;
    else this._createObservableOptions(options);
  }
  private _options!: Observable<Option<K, V>[] | Option<K, V>[][] | Group<K, V>>;
  private _optionsCache: ReplaySubject<Option<K, V>[] | Option<K, V>[][] | Group<K, V>> | undefined;

  /**
   * allow user to open selection in modal
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean | string) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;
  /**
   * allow user to open selection in modal
   */
  @Input()
  get dialog(): boolean {
    return this._dialog;
  }
  set dialog(value: boolean | string) {
    this._dialog = coerceBooleanProperty(value);
  }
  private _dialog = false;
  /**
   * get the template for the overlay that contains ng-content
   */
  @ViewChild('valueRef', { read: ViewContainerRef }) private _valueRef!: ViewContainerRef;
  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;

  @ContentChild(ValueDirective) private _valueTemplate?: ValueDirective;
  @ContentChildren(GroupDirective) private _groups!: QueryList<GroupDirective<K, V>>;
  @ContentChildren(KCOptionsDirective) private _option!: QueryList<KCOptionsDirective<K, V>>;

  set value(val: OptionValue<V> | OptionGroupValue<V>) {
    this._value = val;
    this._cdr.detectChanges();
  }
  get value(): OptionValue<V> | OptionGroupValue<V> {
    return this._value;
  }
  private _value!: OptionValue<V> | OptionGroupValue<V>;
  /**
   * panelOpen is for open/close the overlay panel
   */
  panelOpen = false;
  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened = false;
  selection!: MapEmit<K | V | string, Option<K, V> | OptionSelection<K, V>, boolean>;

  private _dialogOverlayRef: OverlayRef | undefined;
  private _destroy: Subject<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: () => unknown = () => {};

  constructor(private _overlay: Overlay, private _viewContainerRef: ViewContainerRef, private _cdr: ChangeDetectorRef) {
    this._destroy = new Subject<void>();
  }

  ngAfterContentInit(): void {
    this.options.pipe(takeUntil(this._destroy)).subscribe((options) => {
      if (this._groups) this._groups.forEach((group) => group.render(options));
      if (this._option)
        this._option.forEach((group, index) =>
          group.render(
            this._getOptions(options as Option<K, V>[] | Option<K, V>[][])[index] as unknown as Option<K, V>[],
          ),
        );
    });

    if (this._valueTemplate) this._valueRef.createEmbeddedView(this._valueTemplate.template);
  }

  writeValue(obj: OptionValue<V> | OptionGroupValue<V>): void {
    this.value = obj;

    if (!this.selection) this._initSelectionModel();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => unknown): void {
    this.onTouch = fn;
  }

  open(): void {
    if (this.dialog) this._openDialog();
    else this.panelOpen = true;

    this.selectionOpened = true;
  }

  close(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    // check if html element contains a angular directive
    if (this.selectionOpened && element.hasAttribute('prevent-close')) return;

    if (this.dialog) this._closeDialog();
    else this.panelOpen = false;

    this.selectionOpened = false;
  }

  private _initSelectionModel(): void {
    this._getSelectedOptions
      .pipe(
        /**
         * get first event from selected options to initialize selection model
         */
        first(),
        map((options) => options && (this.multiple ? options : options[0])),
        map(
          (options) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            new MapEmit<K | V | string, Option<K, V> | OptionSelection<K, V>, boolean>(this.multiple, options),
        ),
        tap((selection) => (this.selection = selection)),
        switchMap((selectionModel) => selectionModel.changed),
        takeUntil(this._destroy),
      )
      .subscribe(() => {
        /**
         * When the groups are initialized, the selectionModel changes from the AfterContentInit hook
         * Angular does not expect events to be raised during change detection, so any state change
         * (such as a form control's 'ng-touched') will cause a changed-after-checked error.
         */
        void Promise.resolve().then(() => this._onSelect());
      });
  }

  private _getOptions(options: Option<K, V>[] | Option<K, V>[][]): Option<K, V>[][] {
    if (this._isOptionChunks(options)) return options;

    return [options];
  }

  private get _getSelectedOptions(): Observable<[K | V, Option<K, V>][] | undefined> {
    return this.options.pipe(
      map((options) => {
        if (Array.isArray(options)) {
          if (this._isOptionChunks(options)) {
            return options.flat().filter((option) => {
              if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

              return this.value === option.value;
            });
          } else
            return options.filter((option) => {
              if (Array.isArray(this.value)) return this.value.some((value) => value === option.value);

              return this.value === option.value;
            });
        }

        return undefined;
      }),
      map((options) => options?.map((option) => [option.key || option.value, option])),
    );
  }

  private _isOptionChunks(option: Option<K, V>[] | Option<K, V>[][]): option is Option<K, V>[][] {
    return Array.isArray(option[0]);
  }

  private _createObservableOptions(options: Option<K, V>[] | Option<K, V>[][] | Group<K, V>): void {
    if (!this._optionsCache) {
      this._optionsCache = new ReplaySubject();
      this._options = this._optionsCache;
    }

    this._optionsCache.next(options);
  }

  private _openDialog(): void {
    const overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      disposeOnNavigation: true,
    });

    const dialogPortal = new TemplatePortal(this.templateRef, this._viewContainerRef);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;
    overlayRef.backdropClick().subscribe((event) => this.close(event));
  }

  private _closeDialog(): void {
    this._dialogOverlayRef!.dispose();
    this._dialogOverlayRef = undefined;
  }

  /** Invoked when an option is clicked. */
  private _onSelect(): void {
    const valueToEmit = this._getSelectionValues();

    this._value = valueToEmit!;
    this._onChange(valueToEmit);
    this._cdr.detectChanges();
  }

  private _getSelectionValues() {
    return getValues<K | V | string, V>(this.selection);
  }
}
