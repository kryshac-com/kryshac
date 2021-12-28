import { InjectionToken } from '@angular/core';

import { OptionGroupValue, OptionValue } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VALUE = new InjectionToken<OptionValue<any> | OptionGroupValue<any>>('VALUE');
