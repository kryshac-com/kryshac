import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { KCOptionsDirective, KCOptionDirective } from '../../directives';

@Component({
  selector: 'lib-wrap-dialog-options',
  templateUrl: './wrap-dialog-options.component.html',
  styleUrls: ['./wrap-dialog-options.component.scss']
})
export class WrapDialogOptionsComponent implements OnInit, OnChanges {
  @Input() public optionsTemplate!: QueryList<KCOptionsDirective>;

  @Input() public options!: unknown;

  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  private _context!: { $implicit: unknown };

  ngOnChanges(): void {
    if (this._context) this._context.$implicit = this.options;
  }

  ngOnInit(): void {
    console.log('init warp');
    this._context = { $implicit: this.options };

    this.optionsTemplate.forEach(optionsTemplate => {
      const dialog = optionsTemplate.template.createEmbeddedView(this._context);
      this._outlet.insert(dialog);
    });
  }
}
