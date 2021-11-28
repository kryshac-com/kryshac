import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo-autocomplete',
  templateUrl: './demo-autocomplete.component.html',
  styleUrls: ['./demo-autocomplete.component.scss']
})
export class DemoAutocompleteComponent {
  control = new FormControl('test');
}
