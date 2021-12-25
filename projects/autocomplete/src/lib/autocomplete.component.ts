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

import { SelectionModel } from 'dist/selection-model';

import { KCOptionsDirective, ValueDirective } from './directives';
import { SELECTION } from './tokens';
import { Option, OptionGroup, OptionObj, Options, getValues } from './types';

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
      useFactory: (autocomplete: AutocompleteComponent) => autocomplete.selectionModel,
      deps: [forwardRef(() => AutocompleteComponent)],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  @Input()
  get options(): Observable<Options | OptionGroup> {
    return this._options;
  }
  set options(options: Observable<Options | OptionGroup> | Options | OptionGroup) {
    if (isObservable(options)) this._options = options;
    else this._createObservableOptions(options);
  }
  private _options!: Observable<Options | OptionGroup>;
  private _optionsCache: ReplaySubject<Options | OptionGroup> | undefined;

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
  @ContentChildren(KCOptionsDirective, { descendants: true })
  public optionsTemplate!: QueryList<KCOptionsDirective>;

  set value(val: unknown) {
    this._value = val;
  }
  get value(): unknown {
    return this._value;
  }
  private _value: unknown;
  /**
   * panelOpen is for open/close the overlay panel
   */
  panelOpen = false;
  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened = false;

  selectionModel!: SelectionModel<Option<string> | OptionObj<string>>;

  private _dialogOverlayRef: OverlayRef | undefined;
  private _destroy: Subject<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: () => unknown = () => {};

  constructor(private _overlay: Overlay, private _viewContainerRef: ViewContainerRef, private _cdr: ChangeDetectorRef) {
    this._value = '';
    this._destroy = new Subject<void>();
  }

  ngAfterContentInit(): void {
    console.log('size:', this.optionsTemplate.length);
  }

  ngOnInit(): void {
    this.selectionModel = new SelectionModel<Option<string> | OptionObj<string>>(undefined, this.multiple);

    const temp = this.valueTemplate.template.createEmbeddedView({});
    this._valueRef.insert(temp);

    this.selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._onSelect();
    });
  }

  writeValue(obj: unknown): void {
    this.value = obj;
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

  private _createObservableOptions(options: Options | OptionGroup): void {
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
    setTimeout(() => {
      this._propagateChanges();
    });
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    const valueToEmit = this._getSelectionValues();

    this._value = valueToEmit;
    this._onChange(valueToEmit);
    this._cdr.detectChanges();
  }

  private _getSelectionValues() {
    return getValues(this.selectionModel as unknown as any);
  }
}
