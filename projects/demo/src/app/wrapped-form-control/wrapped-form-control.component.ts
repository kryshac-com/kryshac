import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { WrappedFormControl, provideValueAccessor } from '@kryshac/forms';

@Component({
  selector: 'app-custom',
  template: `
    <input [(ngModel)]="value" />
    <span>{{ value }}</span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomComponent implements ControlValueAccessor {
  onChange: any = () => {};
  onTouch: any = () => {};

  private _value: any;
  set value(val: any) {
    this._value = val;
  }
  get value(): any {
    return this._value;
  }

  writeValue(obj: any): void {
    this._value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}

@Component({
  selector: 'app-wrapped-custom',
  template: `
    <app-custom></app-custom>
  `,
  providers: [provideValueAccessor(WrappedCustomComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrappedCustomComponent extends WrappedFormControl {}

@Component({
  selector: 'app-wrapped-input',
  template: `
    <input ngDefaultControl type="text" />
  `,
  providers: [provideValueAccessor(WrappedInputComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrappedInputComponent extends WrappedFormControl {}

@Component({
  selector: 'app-wrapped-form-control',
  templateUrl: './wrapped-form-control.component.html',
  styleUrls: ['./wrapped-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrappedFormControlComponent {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      custom: 'custom',
      input: 'input',
    });
  }
}
