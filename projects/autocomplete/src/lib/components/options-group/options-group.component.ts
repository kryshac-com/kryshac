import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { SelectionModel } from 'dist/selection-model';

import { KCOptionDirective, KCOptionsDirective } from '../../directives';
import { OPTIONS, SELECTION } from '../../tokens';

@Component({
  selector: 'kc-options-group',
  templateUrl: './options-group.component.html',
  styleUrls: ['./options-group.component.scss'],
  providers: [
    {
      provide: SELECTION,
      useFactory: (autocomplete: OptionsGroupComponent) => autocomplete.selectionModel,
      deps: [forwardRef(() => OptionsGroupComponent)],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsGroupComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() key!: string;
  /**
   * allow user to open selection in modal
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean | string) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @ContentChild(KCOptionDirective, { static: true }) public optionTemplate!: KCOptionDirective;
  @ContentChildren(KCOptionsDirective) public optionsTemplate!: QueryList<KCOptionsDirective>;
  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  selectionModel!: SelectionModel<{ key: string; value: unknown }>;

  private _destroy: Subject<void> = new Subject();

  // @Input() options!: Record<string, { value: any[] }>;

  constructor(
    @SkipSelf() @Inject(SELECTION) private _selection: SelectionModel<{ key: string; value: unknown }>,
    private _cdr: ChangeDetectorRef,
    @SkipSelf() @Inject(OPTIONS) private options: any,
  ) {}

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    return;

    if (this._selection.isSelected({ key: this.key, value: 'value' })) {
      this.selectionModel = this._selection.get({ key: this.key, value: 'value' })!.value as SelectionModel<{
        key: string;
        value: unknown;
      }>;
    } else {
      this.selectionModel = new SelectionModel(undefined, this.multiple);

      if (this._selection.isMultipleSelection())
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
    }

    let allowNext = true;

    this.selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._selection.isSelected({ key: this.key, value: 'value' })) {
        this._selection.update();
      } else if (allowNext) {
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
      }
      allowNext = true;
    });

    this._selection.changed.pipe(takeUntil(this._destroy)).subscribe(() => {
      // clear selection if parent selection is not multiple
      // and this selection is not in the parent selection
      if (
        !this._selection.isMultipleSelection() &&
        !this._selection.isSelected({ key: this.key, value: 'value' }) &&
        this.selectionModel.hasValue()
      ) {
        allowNext = false;
        this.selectionModel.clear();
      }
    });

    this._outlet.clear();

    if (this.optionTemplate) {
      this.options[this.key].value.forEach((option: unknown) => {
        const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
        this._outlet.insert(dialog);
      });
    } else if (this.optionsTemplate) {
      this.optionsTemplate.forEach((optionsTemplate) => {
        const dialog = optionsTemplate.template.createEmbeddedView({ $implicit: this.options[this.key] });
        this._outlet.insert(dialog);
      });
    }
  }
}
