import { MapEmit } from 'dist/selection-model';

import { Option, OptionGroupValue, OptionSelection, OptionValue } from '../types';

export function getValues<K, V>(
  values: MapEmit<K | string, Option<K, V> | OptionSelection<K, V>, boolean>,
): OptionValue<V> | OptionGroupValue<V> | undefined {
  if (Array.isArray(values.selected)) {
    return values.selected.reduce<V[] | OptionGroupValue<V> | undefined>((acc, item) => {
      if (checkIsOptionValue(item)) {
        const value = [...(acc as []), item.value];

        if (!value.length) return;

        return value;
      }
      /**
       * change the accumulator to an object and check if is the first time
       * because next time will be and object and we not need to create a new object
       */
      if (Array.isArray(acc)) acc = {};

      const value = getValues(item.value);

      if (!value) return acc;

      return {
        ...acc,
        [item.key]: value,
      };
    }, []);
  } else if (checkIsOptionSelection(values.selected)) {
    const value = getValues(values.selected.value);

    if (!value) return;

    if (Array.isArray(value) && !value.length) return;

    return {
      [values.selected.key]: value,
    };
  }

  return values.selected?.value;
}

function checkIsOptionValue<K, V>(item: Option<K, V> | OptionSelection<K, V>): item is Option<K, V> {
  return !(item.value instanceof MapEmit);
}

function checkIsOptionSelection<K, V>(item: V | Option<K, V> | OptionSelection<K, V>): item is OptionSelection<K, V> {
  return (item as OptionSelection<K, V>)?.value instanceof MapEmit;
}
