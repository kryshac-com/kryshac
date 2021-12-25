import { Option } from './option.type';

export type Options =
  | Option[]
  | Record<
      string,
      {
        label: string;
        value: Option[];
      }
    >;
