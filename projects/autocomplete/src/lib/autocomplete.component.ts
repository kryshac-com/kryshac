import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements ControlValueAccessor {
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
  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;

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

  private _dialogOverlayRef: OverlayRef | undefined;

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this._value = '';
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
