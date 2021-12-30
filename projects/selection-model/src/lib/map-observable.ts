import { Observable, Subject } from 'rxjs';

type Event<K, V> = [K, V];

interface Options {
  emitEvent?: boolean;
}
/**
 * Event emitted when the value of a SelectionModel has changed.
 * @docs-private
 */
export interface MapEmitChange<K, V, T extends boolean> {
  /** Model that dispatched the event. */
  source: MapEmit<K, V, T>;
  added?: T extends false ? Event<K, V> : Event<K, V>[];
  removed?: T extends false ? Event<K, V> : Event<K, V>[];
  updated?: T extends false ? Event<K, V> : Event<K, V>[];
}

/**
 * Class to be used to power selecting one or more options from a list.
 */
export class MapEmit<K, V, T extends boolean> {
  /** Event emitted when the value has changed. */
  changed: Observable<MapEmitChange<K, V, T>>;

  private _changed: Subject<MapEmitChange<K, V, T>>;

  /** Currently-selected values. */
  private _map: Map<K, V>;

  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  private _setToEmit: Event<K, V> | Event<K, V>[] = [];

  /** Keeps track of the selected options that haven't been emitted by the change event. */
  private _deletedToEmit: Event<K, V> | Event<K, V>[] = [];

  /** Keeps track of the selected options that haven't been emitted by the change event. */
  private _updatedToEmit: Event<K, V> | Event<K, V>[] = [];

  /** Cache for the array value of the selected items. */
  private _selected!: (T extends false ? V : V[]) | null;

  constructor(private _multiple: T = false as T, initiallyValues?: T extends false ? [K, V] : [K, V][]) {
    this._map = new Map<K, V>();

    this._changed = new Subject();
    this.changed = this._changed.asObservable();
    /**
     * if we dont have initially selected values, exit from constructor
     */
    if (!initiallyValues?.length) return;

    // if (multiple) initiallyValues.forEach(([key, value]) => this._markSet(key, value, { emitEvent: false }));
    // else this._markSet(initiallyValues[0], initiallyValues[1], { emitEvent: false });

    // Clear the array in order to avoid firing the change event for preselected values.
    this._setToEmit.length = 0;
  }

  /** Selected values. */
  get selected(): (T extends false ? V : V[]) | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    if (this._multiple) this._selected = Array.from(this._map.values()) as unknown as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    else this._selected = this._map.values().next().value as unknown as any;

    return this._selected;
  }

  /**
   * Selects a value or an array of values.
   */
  set(key: K, value: V, options?: Options): void;
  set(values: [key: K, value: V][], options?: Options): void;
  set(first: K | [key: K, value: V][], second?: V | Options, options?: Options): void {
    if (Array.isArray(first)) {
      this._verifyValueAssignment(first);
      first.forEach((value) => this._markSet(...value, options));
    } else {
      this._markSet(first, second as V, options);
    }

    this._emitChangeEvent();
  }

  /**
   * Selects a value or an array of values.
   */
  update(key: K, value: V, options?: Options): void;
  update(values: [key: K, value: V][], options?: Options): void;
  update(first: K | [key: K, value: V][], second?: V | Options, options?: Options): void {
    if (Array.isArray(first)) {
      this._verifyValueAssignment(first);
      first.forEach((value) => this._markUpdated(...value, options));
    } else {
      this._markUpdated(first, second as V, options);
    }
    this._emitChangeEvent();
  }

  /**
   * Deselects a value or an array of values.
   */
  delete(key: K, options?: Options): void;
  delete(keys: K[], options?: Options): void;
  delete(values: K | K[], options?: Options): void {
    if (Array.isArray(values)) {
      this._verifyValueAssignment(values);
      values.forEach((key) => this._unMarkDelete(key, options));
    } else {
      this._unMarkDelete(values, options);
    }

    this._emitChangeEvent();
  }

  /**
   * Toggles a value between selected and deselected.
   */
  toggle(key: K, value: V, options?: Options): void {
    this.has(key) ? this.delete(key, options) : this.set(key, value, options);
  }

  /**
   * Clears all of the selected values.
   */
  clear(options?: Options): void {
    this._unMarkAll(options);
    this._emitChangeEvent();
  }
  /**
   * Determines whether a value is selected.
   */
  get(key: K): V | undefined {
    return this._map.get(key);
  }
  /**
   * Determines whether a value is selected.
   */
  has(key: K): boolean {
    return this._map.has(key);
  }

  /**
   * Determines whether the model does not have a value.
   */
  isEmpty(): boolean {
    return this._map.size === 0;
  }

  /**
   * Determines whether the model has a value.
   */
  hasValue(): boolean {
    return !this.isEmpty();
  }

  // /**
  //  * Sorts the selected values based on a predicate function.
  //  */
  // sort(predicate?: (a: T, b: T) => number): void {
  //   if (this._multiple && this.selected) {
  //     this._selected?.sort(predicate);
  //   }
  // }

  // /**
  //  * Gets whether multiple values can be selected.
  //  */
  // isMultipleSelection(): boolean {
  //   return this._multiple;
  // }

  // /** Emits a change event and clears the records of selected and deselected values. */
  private _emitChangeEvent() {
    // Clear the selected values so they can be re-cached.
    this._selected = null;

    if (this._setToEmit || this._updatedToEmit || this._deletedToEmit) {
      this._changed.next({
        source: this,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        ...(this._setToEmit.length && { added: this._setToEmit as unknown as any }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        ...(this._updatedToEmit.length && { updated: this._updatedToEmit as unknown as any }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        ...(this._deletedToEmit.length && { removed: this._deletedToEmit as unknown as any }),
      });

      this._setToEmit = [];
      this._updatedToEmit = [];
      this._deletedToEmit = [];
    }
  }

  // /** Selects a value. */
  private _markSet(key: K, value: V, options?: Options): void {
    /**
     * if value is already selected, exit from method
     */
    if (this.has(key)) return;
    /**
     * if is not multiple, clear all selected values
     * because we can only select one value
     */
    if (!this._multiple) this._unMarkAll(options);
    /**
     * set new selected value
     */
    this._map.set(key, value);

    /**
     * emit an event if user have emitChanges
     */
    if (options?.emitEvent && !options.emitEvent) return;

    console.log('test');
    if (this._multiple) (this._setToEmit as Event<K, V>[]).push([key, value]);
    else this._setToEmit = [key, value];
  }

  // /** Selects a value. */
  private _markUpdated(key: K, value: V, options?: Options): void {
    this._map.set(key, value);

    /**
     * emit an event if user have emitChanges
     */
    if (options?.emitEvent && !options.emitEvent) return;

    if (this._multiple) (this._updatedToEmit as Event<K, V>[]).push([key, value]);
    else this._updatedToEmit = [key, value];
  }

  /** Deselects a value. */
  private _unMarkDelete(key: K, options?: Options): void {
    if (!this.has(key)) return;

    const value = this.get(key)!;

    this._map.delete(key);

    /**
     * emit an event if user have emitChanges
     */
    if (options?.emitEvent && !options.emitEvent) return;

    if (this._multiple) (this._deletedToEmit as Event<K, V>[]).push([key, value]);
    else this._deletedToEmit = [key, value];
  }

  /** Clears out the selected values. */
  private _unMarkAll(options?: Options): void {
    if (this.isEmpty()) return;

    this._map.forEach((_, key) => this._unMarkDelete(key, options));
  }
  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  private _verifyValueAssignment(values: unknown[]) {
    if (values.length > 1 && !this._multiple && ngDevMode)
      throw Error('Cannot pass multiple values into SelectionModel with single-value mode.');
  }
}

// const tst = new MapEmit(false, ['stes', 'test']);
// const tsts = new MapEmit(true, [['stes', 'test']]);

// const tsts = tst.selected;
