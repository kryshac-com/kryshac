import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(options: Observable<any>) {}
}
