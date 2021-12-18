import { Component, ContentChild, forwardRef, Inject, Input, OnDestroy, OnInit, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';
import { KCOptionDirective } from '../../directives';
import { OPTIONS, SELECTION } from '../../tokens';
import { SelectionModel } from 'dist/selection-model';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Option } from '../../types';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'kc-options-group',
  templateUrl: './options-group.component.html',
  styleUrls: ['./options-group.component.scss'],
  providers: [
    {
      provide: SELECTION,
      useFactory: (autocomplete: OptionsGroupComponent) => autocomplete.selectionModel,
      deps: [forwardRef(() => OptionsGroupComponent)],
    }
  ]
})
export class OptionsGroupComponent implements OnInit, OnDestroy {
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
  /**
   *  { static: true } needs to be set when you want to access the ViewChild in ngOnInit.
   */
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  selectionModel!: SelectionModel<{ key: string; value: unknown }>;

  private _destroy: Subject<void> = new Subject();

  constructor(
   @SkipSelf() @Inject(SELECTION) private _selection: SelectionModel<{ key: string; value: unknown}>,
   @Inject(OPTIONS) private _options: Observable<Record<string, Option<Option<string>[]>>>,
  ) {
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    if (this._selection.isSelected({key: this.key, value: 'value'})) {
      this.selectionModel = this._selection.get({key: this.key, value: 'value'})!.value as SelectionModel<{ key: string; value: unknown}>;
    } else {
      this.selectionModel = new SelectionModel(undefined, this.multiple);


      if (this._selection.isMultipleSelection())
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
    }

    let allowNext = true;

    this.selectionModel.changed.pipe(
      takeUntil(this._destroy),
    ).subscribe(({added, removed, source}) => {
      console.log('selection changed', this.key);

      // if (!source.isEmpty()) {
      //   if (source.isSelected(({ key: this.key, value: 1 })))
      //     this._selection.update();
      //   else
      //     this._selection.select({
      //       key: this.key,
      //       value: this.selectionModel,
      //     });
      // }

      console.log('if',
        this.key,
        !this._selection.isSelected({key: this.key, value: 'value'}),
        allowNext
    )

      if (
        !this._selection.isSelected({key: this.key, value: 'value'}) &&
        allowNext
      ) {
        console.log('selection changed add key', this.key);
        this._selection.select({
          key: this.key,
          value: this.selectionModel,
        });
      }
      allowNext = true;
    })

    this._selection.changed.pipe(
      takeUntil(this._destroy),
    ).subscribe(({source}) => {
      console.log('parent selection changed', this.key);
      // clear selection if parent selection is not multiple
      // and this selection is not in the parent selection
      if (
        !this._selection.isMultipleSelection() &&
        !this._selection.isSelected({ key: this.key, value: 'value' }) &&
        this.selectionModel.hasValue()
      ) {
        console.log('clear selection', this.key);
        allowNext = false;
        this.selectionModel.clear();
      }
    });

    this._options.pipe(
      takeUntil(this._destroy),
    ).subscribe((options) => {
      this._outlet.clear();

      options[this.key].value.forEach((option: unknown) => {
        const dialog = this.optionTemplate.template.createEmbeddedView({ $implicit: option });
        this._outlet.insert(dialog);
      })
    });

  }

  ngAfterViewChecked(): void {
  }
}
