import { Group, Option, OptionGroup } from '../types';

export function filterNestedOptions(options: Option<string, string>[], search: string): Option<string, string>[];
export function filterNestedOptions(options: Option<string, string>[][], search: string): Option<string, string>[][];
export function filterNestedOptions(options: Group<string, string>, search: string): Group<string, string>;
export function filterNestedOptions(
  options: Option<string, string>[] | Option<string, string>[][] | Group<string, string>,
  search: string,
): Option<string, string>[] | Option<string, string>[][] | Group<string, string> {
  if (isOptionChunks(options)) return options.map((option) => filterNestedOptions(option, search));
  else if (Array.isArray(options))
    return options.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase()));
  else {
    return Object.entries(options).reduce<Group<string, string>>((acc, [key, item]) => {
      if (isOptionObject(item))
        acc[key] = {
          ...item,
          value: isOptionChunks(item.value)
            ? filterNestedOptions(item.value, search)
            : filterNestedOptions(item.value, search),
        };
      else acc[key] = filterNestedOptions(item, search);

      return acc;
    }, {});
  }
}

export function isOptionChunks(
  option: Option<string, string>[] | Option<string, string>[][] | Group<string, string>,
): option is Option<string, string>[][] {
  return Array.isArray(option) && Array.isArray(option[0]);
}

export function isOptionObject(
  option: Group<string, string> | OptionGroup<string, string>,
): option is OptionGroup<string, string> {
  return !!option.value;
}
