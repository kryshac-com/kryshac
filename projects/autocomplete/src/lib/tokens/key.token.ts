import { InjectionToken } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export const KEY = new InjectionToken<ReplaySubject<string>>('KEY');
export const KEYFactory = () => new ReplaySubject<string>();
