import { InjectionToken } from '@angular/core';

import { MapEmit } from 'dist/selection-model';

export const SELECTION = new InjectionToken<MapEmit<unknown, unknown>>('SELECTION');
