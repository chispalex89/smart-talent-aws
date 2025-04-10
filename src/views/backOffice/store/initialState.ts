import { TableQueries } from '@/@types/common';
import { Company, Permission, Role, User } from '@prisma/client';

export const initialTableData: TableQueries = {
  pageIndex: 1,
  pageSize: 10,
  query: '',
  sort: {
    id: 'desc',
  },
};

export function getInitialState<T>(): {
  tableData: TableQueries;
  filterData: {};
  orderList: T[];
} {
  return {
    tableData: initialTableData,
    filterData: {},
    orderList: [] as T[],
  };
}
