import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrappedFormControlRoutingModule } from './wrapped-form-control-routing.module';
import { CustomComponent, WrappedCustomComponent, WrappedFormControlComponent, WrappedInputComponent } from './wrapped-form-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WrappedFormControlComponent,
    CustomComponent,
    WrappedCustomComponent,
    WrappedInputComponent
  ],
  imports: [
    CommonModule,
    WrappedFormControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class WrappedFormControlModule { }
