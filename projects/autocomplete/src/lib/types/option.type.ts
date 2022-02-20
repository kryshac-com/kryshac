import { MapEmit } from 'dist/selection-model';

/**
 * options type for input options
 */
export interface Option<K, V> {
  value: V;
  key?: K;
  label?: string;
}

export type Group<K, V> = {
  [K: string]: Group<K, V> | OptionGroup<K, V>;
};

export interface OptionGroup<K, V> {
  value: Option<K, V>[] | Option<K, V>[][];
  label?: string;
}

/**
 * options type for output options
 */
export type OptionValue<V> = V | V[];

export type OptionGroupValue<V> = {
  [K: string]: OptionValue<V> | OptionGroupValue<V>;
};

/**
 * options for internal structure
 */
export type OptionSelection<K, V> = MapEmit<string | K | V, Option<K, V> | OptionSelection<K, V>, boolean>;
