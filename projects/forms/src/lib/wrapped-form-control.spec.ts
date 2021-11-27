import { ChangeDetectionStrategy, Component, DebugElement, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideValueAccessor } from './provide-value-accessor';

import { WrappedFormControl } from './wrapped-form-control';

@Component({
  selector: 'app-input',
  template: `
    <input [(ngModel)]="value"/>
    <span>{{ value }}</span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class InputComponent implements ControlValueAccessor {
  onChange: any = () => {};
  onTouch: any = () => {}

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
  selector: 'app-child',
  template: `<app-input></app-input>`,
  providers: [
    provideValueAccessor(ChildComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ChildComponent extends WrappedFormControl {}

@Component({
  selector: 'app-parent',
  template: `
    <form [formGroup]="form">
      <app-child formControlName="input"></app-child>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ParentComponent {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      input: 'default',
    });
  }
}

@Component({
  selector: 'app-error-child',
  template: `<span></span>`,
  providers: [
    provideValueAccessor(ErrorChildComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorChildComponent extends WrappedFormControl {}

@Component({
  selector: 'app-error-parent',
  template: `
    <form [formGroup]="form">
      <app-error-child formControlName="input"></app-error-child>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorParentComponent {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      input: 'default',
    });
  }
}

describe('WrappedFormControl', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;
  let input: DebugElement;
  let inputNative: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentComponent, ChildComponent, InputComponent, ErrorChildComponent, ErrorParentComponent ],
      imports: [FormsModule, ReactiveFormsModule],
    })
    .overrideComponent(ParentComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .overrideComponent(ChildComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .overrideComponent(InputComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .overrideComponent(ErrorParentComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .overrideComponent(ErrorChildComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;

    input = fixture.debugElement.query(By.directive(InputComponent))!;
    inputNative = input.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('default value', () => {
    const span = inputNative.querySelector('span');
    expect(span?.textContent).toContain('default');
  });

  it('patch value', () => {
    component.form.patchValue({ input: 'test' });
    fixture.detectChanges();
    const span = inputNative.querySelector('span');
    expect(span?.textContent).toContain('test');
  });

  it('error without component control', () => {
    const test = TestBed.createComponent(ErrorParentComponent);
    test.destroy = () => {};

    expect(() => test.detectChanges()).toThrowError(/ngDefaultControl/);
  });

  it('error without component control and show the class name for the component', () => {
    const test = TestBed.createComponent(ErrorParentComponent);
    test.destroy = () => {};

    expect(() => test.detectChanges()).toThrowError(/ErrorChildComponent/);
  });
});
