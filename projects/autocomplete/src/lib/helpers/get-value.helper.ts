import { SelectionModel } from 'dist/selection-model';

import { Option, OptionObjectValue, OptionSelection } from '../types';

export function getValues<T extends number | string>(
  values: SelectionModel<Option<T> | OptionSelection<T>>,
): T[] | OptionObjectValue<T> {
  return values.selected.reduce<T[] | OptionObjectValue<T>>((acc, item) => {
    if (checkIsOptionValue(item)) return [...(acc as []), item.value];
    /**
     * change the accumulator to an object and check if is the first time
     * because next time will be and object and we not need to create a new object
     */
    if (Array.isArray(acc)) acc = {};

    return {
      ...acc,
      [item.key]: getValues(item.value),
    };
  }, []);
}

function checkIsOptionValue<T extends number | string>(item: Option<T> | OptionSelection<T>): item is Option<T> {
  return !(item.value instanceof SelectionModel);
}
