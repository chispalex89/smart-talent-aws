export interface Pagination<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TableQueries {
  pageIndex: number;
  pageSize: number;
  sort: Record<string, string>;
  query: string;
}

export type Filter = {
  [key: string]: unknown;
};
