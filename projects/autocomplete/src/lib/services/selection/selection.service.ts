import { Injectable } from '@angular/core';

import { SelectionModel } from 'dist/selection-model';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  test!: SelectionModel<{ key: string; value: unknown }>;

  change(selection: SelectionModel<{ key: string; value: unknown }>) {
    this.test = selection;
  }
}
