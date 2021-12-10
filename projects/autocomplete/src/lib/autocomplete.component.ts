import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, ContentChild, forwardRef, Inject, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { Option } from './types';
import { KCOptionsDirective, KCOptionDirective, ValueDirective } from './directives';
import { SELECTION } from './tokens';
import { SelectionModel } from 'dist/selection-model';

@Component({
  selector: 'autocomplete',
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
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() options!: Observable<Option[]> | Option[];
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
  @ContentChild(KCOptionsDirective, { static: true }) public optionsTemplate!: KCOptionsDirective;


  set value(val: string) {
    this._value = val;
  }
  get value(): string {
    return this._value;
  }
  private _value: string;

  onChange: any = () => {};
  onTouch: any = () => {}
  /**
   * panelOpen is for open/close the overlay panel
   */
  panelOpen: boolean = false;
  /**
   * selectionOpened variable is for check if the overlay or dialog is open
   */
  selectionOpened: boolean = false;

  selectionModel!: SelectionModel<{value: number}>;

  private _dialogOverlayRef: OverlayRef | undefined;


  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this._value = '';
  }

  ngOnInit(): void {
    this.selectionModel = new SelectionModel(undefined, this.multiple);

    const temp = this.valueTemplate.template.createEmbeddedView({});
    this._valueRef.insert(temp);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  open(): void {
    if (this.dialog) this._openDialog();
    else this.panelOpen = true;

    this.selectionOpened = true;
  }

  close(): void {
    if (this.dialog) this._closeDialog();
    else this.panelOpen = false;

    this.selectionOpened = false;
  }

  private _openDialog(): void {
    const overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      disposeOnNavigation: true,
    });

    const dialogPortal = new TemplatePortal(this.templateRef, this._viewContainerRef);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;
    overlayRef.backdropClick().subscribe(() => this.close());
  }

  private _closeDialog(): void {
    this._dialogOverlayRef!.dispose();
    this._dialogOverlayRef = undefined;
  }
}
