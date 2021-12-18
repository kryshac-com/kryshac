import { AfterViewChecked, AfterViewInit, Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { KCOptionDirective } from '../../directives/option/option.directive';

@Component({
  selector: 'kc-options',
  templateUrl: './kc-options.component.html',
  styleUrls: ['./kc-options.component.scss']
})
export class KCOptionsComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  // @Input() public optionTemplate!: KCOptionDirective;
  @Input() public options!: Observable<unknown[]>;


  @ContentChild(KCOptionDirective, { static: true }) public optionTemplate!: KCOptionDirective;
  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  ngAfterViewInit(): void {
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    console.log(this.options);

    this.options.subscribe((options) => {
      this._outlet.clear();

      options.forEach((option: unknown) => {
        const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
        this._outlet.insert(dialog);
      })
    })
  }

  ngAfterViewChecked(): void {
  }
}
