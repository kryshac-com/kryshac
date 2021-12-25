import { Component, ContentChild, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { KCOptionDirective } from '../../directives/option/option.directive';

@Component({
  selector: 'kc-options',
  templateUrl: './kc-options.component.html',
  styleUrls: ['./kc-options.component.scss'],
})
export class KCOptionsComponent implements OnInit {
  // @Input() public optionTemplate!: KCOptionDirective;
  @Input() public options!: unknown[];

  @ContentChild(KCOptionDirective, { static: true }) public optionTemplate!: KCOptionDirective;
  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  ngOnInit(): void {
    this._outlet.clear();

    this.options.forEach((option: unknown) => {
      const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
      this._outlet.insert(dialog);
    });
  }
}
