import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import type { FavoriteCandidate, Filter } from '../types';

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

export type FavoriteCandidateListState = {
  tableData: TableQueries;
  filterData: Filter;
  selectedFavoriteCandidate: Partial<FavoriteCandidate>[];
};

type FavoriteCandidateListAction = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
  setSelectedFavoriteCandidate: (
    checked: boolean,
    customer: FavoriteCandidate,
  ) => void;
  setSelectAllFavoriteCandidate: (customer: FavoriteCandidate[]) => void;
};

const initialState: FavoriteCandidateListState = {
  tableData: initialTableData,
  filterData: initialFilterData,
  selectedFavoriteCandidate: [],
};

export const useFavoriteCandidateListStore = create<
  FavoriteCandidateListState & FavoriteCandidateListAction
>((set) => ({
  ...initialState,
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
  setSelectedFavoriteCandidate: (checked, row) =>
    set((state) => {
      const prevData = state.selectedFavoriteCandidate;
      if (checked) {
        return { selectedFavoriteCandidate: [...prevData, ...[row]] };
      } else {
        if (
          prevData.some(
            (prevFavoriteCandidate) => row.id === prevFavoriteCandidate.id,
          )
        ) {
          return {
            selectedFavoriteCandidate: prevData.filter(
              (prevFavoriteCandidate) => prevFavoriteCandidate.id !== row.id,
            ),
          };
        }
        return { selectedCustomer: prevData };
      }
    }),
  setSelectAllFavoriteCandidate: (row) =>
    set(() => ({ selectedFavoriteCandidate: row })),
}));
