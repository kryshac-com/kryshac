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
  OnInit,
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

import { SelectionModel } from 'dist/selection-model';

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
      useFactory: (component: AutocompleteComponent) => {
        console.log('get selection');
        return component.selectionModel;
      },
      deps: [forwardRef(() => AutocompleteComponent)],
    },
    {
      provide: VALUE,
      useFactory: (component: AutocompleteComponent) => component.value,
      deps: [forwardRef(() => AutocompleteComponent)],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent<T extends number | string = string>
  implements OnInit, AfterContentInit, ControlValueAccessor
{
  @Input()
  get options(): Observable<Option<T>[] | Group<T>> {
    return this._options;
  }
  set options(options: Observable<Option<T>[] | Group<T>> | Option<T>[] | Group<T>) {
    if (isObservable(options)) this._options = options;
    else this._createObservableOptions(options);
  }
  private _options!: Observable<Option<T>[] | Group<T>>;
  private _optionsCache: ReplaySubject<Option<T>[] | Group<T>> | undefined;

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
  @ViewChild('valueRef', { static: true, read: ViewContainerRef }) private _valueRef!: ViewContainerRef;
  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;
  @ContentChild(ValueDirective, { static: true }) valueTemplate!: ValueDirective;

  @ContentChildren(GroupDirective) groups!: QueryList<GroupDirective<T>>;
  @ContentChildren(KCOptionsDirective) option!: QueryList<KCOptionsDirective<T>>;

  set value(val: OptionValue<T> | OptionGroupValue<T>) {
    this._value = val;
    this._cdr.detectChanges();
  }
  get value(): OptionValue<T> | OptionGroupValue<T> {
    return this._value;
  }
  private _value!: OptionValue<T> | OptionGroupValue<T>;
  /**
   * panelOpen is for open/close the overlay panel
   */
  panelOpen = false;
  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened = false;

  selectionModel!: SelectionModel<Option<T> | OptionSelection<T>>;

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
      if (this.groups) this.groups.forEach((group) => group.render(options));
      if (this.option) this.option.forEach((option) => option.render(options as unknown as Option<T>[]));
    });
  }

  ngOnInit(): void {
    console.log('value', this.value);
  }

  writeValue(obj: OptionValue<T> | OptionGroupValue<T>): void {
    this.value = obj;

    if (!this.selectionModel) this._initSelectionModel();
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
        map((options) => new SelectionModel<Option<T> | OptionSelection<T>>(options, this.multiple)),
        tap((selectionModel) => (this.selectionModel = selectionModel)),
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

  private get _getSelectedOptions(): Observable<Option<T>[] | undefined> {
    return this.options.pipe(
      map((options) => {
        if (Array.isArray(options))
          return options.filter((option) => (this.value as OptionValue<T>).some((value) => value === option.value));

        return undefined;
      }),
    );
  }

  private _createObservableOptions(options: Option<T>[] | Group<T>): void {
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

    this._value = valueToEmit;
    this._onChange(valueToEmit);
    this._cdr.detectChanges();
  }

  private _getSelectionValues() {
    return getValues<T>(this.selectionModel);
  }
}
