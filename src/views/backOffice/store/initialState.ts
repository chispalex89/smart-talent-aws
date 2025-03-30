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

export const getInitialState = (type: string) => {
  switch (type) {
    case 'user':
      return {
        tableData: initialTableData,
        filterData: {},
        orderList: [] as User[],
      };
    case 'company':
      return {
        tableData: initialTableData,
        filterData: {},
        orderList: [] as Company[],
      };
    case 'role':
      return {
        tableData: initialTableData,
        filterData: {},
        orderList: [] as Role[],
      };
    case 'permission':
      return {
        tableData: initialTableData,
        filterData: {},
        orderList: [] as Permission[],
      };
    default:
      return {
        tableData: initialTableData,
        filterData: {},
        orderList: [] as any[],
      };
  }
};
