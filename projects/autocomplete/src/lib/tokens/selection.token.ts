import { SelectionModel } from '@angular/cdk/collections';
import { InjectionToken } from '@angular/core';

export const SELECTION = new InjectionToken<SelectionModel<unknown>>('SELECTION');
export const OPTIONS = new InjectionToken<Record<string, unknown>>('OPTIONS');
