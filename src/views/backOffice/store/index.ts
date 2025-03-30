import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import { Filter } from '../../../types/pagination';
import { getInitialState } from './initialState';
import { Company, Permission, Role, User } from '@prisma/client';

export const initialFilterData = {};

export type ListState<T> = {
  tableData: TableQueries;
  filterData: Filter;
  orderList: T[];
};

type ListActions = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
};

export const useUserListStore = create<ListState<User> & ListActions>(
  (set) => ({
    ...getInitialState('user'),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useCompanyListStore = create<ListState<Company> & ListActions>(
  (set) => ({
    ...getInitialState('company'),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useRoleListStore = create<ListState<Role> & ListActions>(
  (set) => ({
    ...getInitialState('role'),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const usePermissionListStore = create<ListState<Permission> & ListActions>(
  (set) => ({
    ...getInitialState('permission'),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);