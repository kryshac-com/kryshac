import { SelectionModel } from 'dist/selection-model';

export interface Option<T extends string | number = string> {
  key: string;
  value: T | OptionGroup<T>;
  label?: string;
}

export type OptionGroup<T extends string | number = string, K extends keyof any = any> = {
  [P in K]: OptionGroup<T> | OptionObject<T> | Option<T>[];
};

export interface OptionObject<T extends string | number = string> {
  value: Option<T>[];
  label?: string;
}

export interface OptionObj<T extends string | number = string> {
  key: string;
  value: SelectionModel<Option<T>>;
  label?: string;
}

export type OptionObjectValue<T = string | number> = Record<string, T[]>;

export function getValues(
  values: SelectionModel<Option<string> | OptionObj<string>>,
): string[] | OptionObjectValue<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return values.selected.reduce<string[] | OptionObjectValue<string>>((acc, { key, value }) => {
    // change the accumulator to an object if it is an array and value is an object
    if (value instanceof SelectionModel && Array.isArray(acc)) acc = {};

    if (Array.isArray(acc)) return [...acc, value] as string[];

    return {
      ...acc,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      [key]: getValues(value as unknown as any),
    } as OptionObjectValue<string>;
  }, []);
}
