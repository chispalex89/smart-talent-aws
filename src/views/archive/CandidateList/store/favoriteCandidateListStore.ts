import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import type { ArchivedCandidate, Filter } from '../types';

export const initialTableData: TableQueries = {
  pageIndex: 1,
  pageSize: 10,
  query: '',
  sort: {
    id: 'desc',
  },
};

export const initialFilterData = {
  profession: [] as number[],
};

export type ArchivedCandidateListState = {
  tableData: TableQueries;
  filterData: Filter;
  selectedArchivedCandidate: Partial<ArchivedCandidate>[];
};

type ArchivedCandidateListAction = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
  setSelectedArchivedCandidate: (
    checked: boolean,
    customer: ArchivedCandidate,
  ) => void;
  setSelectAllArchivedCandidate: (customer: ArchivedCandidate[]) => void;
};

const initialState: ArchivedCandidateListState = {
  tableData: initialTableData,
  filterData: initialFilterData,
  selectedArchivedCandidate: [],
};

export const useArchivedCandidateListStore = create<
  ArchivedCandidateListState & ArchivedCandidateListAction
>((set) => ({
  ...initialState,
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
  setSelectedArchivedCandidate: (checked, row) =>
    set((state) => {
      const prevData = state.selectedArchivedCandidate;
      if (checked) {
        return { selectedArchivedCandidate: [...prevData, ...[row]] };
      } else {
        if (
          prevData.some(
            (prevArchivedCandidate) => row.id === prevArchivedCandidate.id,
          )
        ) {
          return {
            selectedArchivedCandidate: prevData.filter(
              (prevArchivedCandidate) => prevArchivedCandidate.id !== row.id,
            ),
          };
        }
        return { selectedCustomer: prevData };
      }
    }),
  setSelectAllArchivedCandidate: (row) =>
    set(() => ({ selectedArchivedCandidate: row })),
}));
