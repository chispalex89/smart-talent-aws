import useSWR from 'swr';
import qs from 'qs';
import { useUserListStore } from '../store';
import type { Filter, Pagination } from '../../../types/pagination';
import type { TableQueries } from '@/@types/common';
import { User } from '@prisma/client';
import { getInitialState } from '../store/initialState';
import { useCompanyListStore } from '../store';
import { useRoleListStore } from '../store';
import { usePermissionListStore } from '../store';
import apiService from '../../../services/apiService';

type queryFunction = (
  filterData: Filter,
  tableData: TableQueries,
  endpoint: string
) => {
  list: any[];
  total: number;
  error: any;
  isLoading: boolean;
  tableData: TableQueries;
  filterData: Filter;
  mutate: () => void;
};

const query: queryFunction = (filterData, tableData, endpoint) => {
  const filterDataWithoutEmptyValues = Object.entries(filterData).reduce(
    (prev, curr) => {
      if (curr[1] !== '') {
        return { ...prev, [curr[0]]: curr[1] };
      }
      return prev;
    },
    {}
  );

  const queryString = qs.stringify({
    sort: tableData.sort ? Object.keys(tableData.sort)[0] : undefined,
    order: tableData.sort
      ? tableData.sort[Object.keys(tableData.sort)[0]]
      : undefined,
    pageIndex: tableData.pageIndex,
    pageSize: tableData.pageSize,
    name: tableData.query ? tableData.query : undefined,

    ...filterDataWithoutEmptyValues,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/${endpoint}?${queryString}`,
    (url) => apiService.get<Pagination<any>>(url),
    {
      revalidateOnFocus: false,
    }
  );

  const list = data?.list || [];

  const total = data?.total || 0;

  return {
    list,
    total,
    error,
    isLoading,
    tableData,
    filterData,
    mutate,
  };
};

export function useUserList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useUserListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'user'
  );

  return {
    list,
    total,
    error,
    isLoading,
    tableData,
    filterData,
    setTableData,
    setFilterData,
    mutate,
  };
}

export function useRoleList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useRoleListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'role'
  );

  return {
    list,
    total,
    error,
    isLoading,
    tableData,
    filterData,
    setTableData,
    setFilterData,
    mutate,
  };
}

export function usePermissionList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useRoleListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'permission'
  );

  return {
    list,
    total,
    error,
    isLoading,
    tableData,
    filterData,
    setTableData,
    setFilterData,
    mutate,
  };
}

export function useCompanyList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useCompanyListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'company'
  );

  return {
    list,
    total,
    error,
    isLoading,
    tableData,
    filterData,
    setTableData,
    setFilterData,
    mutate,
  };
}
