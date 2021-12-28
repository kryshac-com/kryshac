import { SelectionModel } from 'dist/selection-model';

/**
 * options type for input options
 */
export interface Option<T extends string | number = string> {
  key: string;
  value: T;
  label?: string;
}

export type Group<T extends string | number = string> = {
  [K: string]: Group<T> | OptionGroup<T>;
};

export interface OptionGroup<T extends string | number = string> {
  value: Option<T>[];
  label?: string;
}

/**
 * options type for output options
 */
export type OptionValue<T extends number | string = string> = T[];

export type OptionObjectValue<T extends number | string> = {
  [K: string]: OptionValue<T> | OptionObjectValue<T>;
};

/**
 * options for internal structure
 */
export interface OptionSelection<T extends string | number = string> {
  key: string;
  value: SelectionModel<Option<T> | OptionSelection<T>>;
  label?: string;
}
