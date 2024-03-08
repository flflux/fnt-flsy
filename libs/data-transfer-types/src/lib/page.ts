import { SortByOrder } from './sort';

export interface PageBase {
  size: number;
  number: number;
  total: number;
  sort: SortByOrder[];
}

export interface Page<T> extends PageBase {
  content: T[];
}
