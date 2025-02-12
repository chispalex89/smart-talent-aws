import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import type { Candidate, Filter } from '../types';

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

export type CandidateListState = {
  tableData: TableQueries;
  filterData: Filter;
  selectedCandidates: Partial<Candidate>[];
};

type CandidateListAction = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
  setSelectedCandidate: (
    checked: boolean,
    candidate: Candidate,
  ) => void;
  setSelectAllCandidate: (customer: Candidate[]) => void;
};

const initialState: CandidateListState = {
  tableData: initialTableData,
  filterData: initialFilterData,
  selectedCandidates: [],
};

export const useCandidateListStore = create<
  CandidateListState & CandidateListAction
>((set) => ({
  ...initialState,
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
  setSelectedCandidate: (checked, row) =>
    set((state) => {
      const prevData = state.selectedCandidates;
      if (checked) {
        return { selectedCandidates: [...prevData, ...[row]] };
      } else {
        if (
          prevData.some(
            (prevCandidate) => row.id === prevCandidate.id,
          )
        ) {
          return {
            selectedCandidates: prevData.filter(
              (prevCandidate) => prevCandidate.id !== row.id,
            ),
          };
        }
        return { selectedCustomer: prevData };
      }
    }),
  setSelectAllCandidate: (row) =>
    set(() => ({ selectedCandidates: row })),
}));
