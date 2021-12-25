import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WrappedFormControlRoutingModule } from './wrapped-form-control-routing.module';
import { CustomComponent, WrappedCustomComponent, WrappedFormControlComponent, WrappedInputComponent } from './wrapped-form-control.component';


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
