import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import type { JobOffers, Filter } from '../types';

export const initialTableData: TableQueries = {
  pageIndex: 1,
  pageSize: 10,
  query: '',
  sort: {
    created_at: 'desc',
  },
};

export const initialFilterData = {
  companyId: 1,
  status: 'active',
};

export type JobOfferListState = {
  tableData: TableQueries;
  filterData: Filter;
  orderList: JobOffers;
};

type JobOfferListAction = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
};

const initialState: JobOfferListState = {
  tableData: initialTableData,
  filterData: initialFilterData,
  orderList: [],
};

export const useJobListStore = create<JobOfferListState & JobOfferListAction>(
  (set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  }),
);
