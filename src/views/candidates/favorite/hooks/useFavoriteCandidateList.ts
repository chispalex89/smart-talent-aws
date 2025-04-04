import useSWR from 'swr';
import { useFavoriteCandidateListStore } from '../store/favoriteCandidateListStore';
import type { GetFavoriteCustomersListResponse } from '../types';
import type { TableQueries } from '@/@types/common';
import apiService from '../../../../services/apiService';
import qs from 'qs';

export default function useFavoriteCandidateList() {
  const {
    tableData,
    filterData,
    setTableData,
    selectedFavoriteCandidate,
    setSelectedFavoriteCandidate,
    setSelectAllFavoriteCandidate,
    setFilterData,
  } = useFavoriteCandidateListStore((state) => state);

  const filterDataWithoutEmptyValues = Object.entries(filterData).reduce(
    (prev, curr) => {
      if (curr[1].length > 0) {
        if (Array.isArray(curr[1])) {
          return { ...prev, [curr[0]]: curr[1].join(',') };
        }
        return { ...prev, [curr[0]]: curr[1] };
      }
      return prev;
    },
    {},
  );

  // Serialize the tableData and filterData into a query string
  const queryString = qs.stringify({
    sort: tableData.sort ? Object.keys(tableData.sort)[0] : undefined,
    order: tableData.sort
      ? tableData.sort[Object.keys(tableData.sort)[0]]
      : undefined,
    pageIndex: tableData.pageIndex,
    pageSize: tableData.pageSize,
    query: tableData.query ? tableData.query : undefined,

    ...filterDataWithoutEmptyValues,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/company-favorite-applicant?${queryString}`,
    (url) =>
      apiService.get<GetFavoriteCustomersListResponse>(
        `/company-favorite-applicant?${queryString}`,
      ),
    {
      revalidateOnFocus: false,
    },
  );

  const favoriteCandidateList = data?.list || [];

  const favoriteCandidateListTotal = data?.total || 0;

  return {
    favoriteCandidateList,
    favoriteCandidateListTotal,
    error,
    isLoading,
    tableData,
    filterData,
    mutate,
    setTableData,
    selectedFavoriteCandidate,
    setSelectedFavoriteCandidate,
    setSelectAllFavoriteCandidate,
    setFilterData,
  };
}
