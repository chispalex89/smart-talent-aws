import useSWR from 'swr';
import { useCandidateListStore as useCandidateListStore } from '../store/candidateListStore';
import type { GetCandidateListResponse } from '../types';
import type { TableQueries } from '@/@types/common';
import apiService from '../../../../services/apiService';
import qs from 'qs';

export default function useCandidateList() {
  const {
    tableData,
    filterData,
    setTableData,
    selectedCandidates,
    setSelectedCandidate,
    setSelectAllCandidate,
    setFilterData,
  } = useCandidateListStore((state) => state);

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
    companyId: 1,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/applicant?${queryString}`,
    (url) =>
      apiService.get<GetCandidateListResponse>(
        `/applicant?${queryString}`,
      ),
    {
      revalidateOnFocus: false,
    },
  );

  const candidateList = data?.list || [];

  const candidateListTotal = data?.total || 0;

  return {
    candidateList,
    candidateListTotal,
    error,
    isLoading,
    tableData,
    filterData,
    mutate,
    setTableData,
    selectedCandidates,
    setSelectedCandidate,
    setSelectAllCandidate,
    setFilterData,
  };
}
