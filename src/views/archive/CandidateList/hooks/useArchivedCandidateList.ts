import useSWR from 'swr';
import { useArchivedCandidateListStore } from '../store/favoriteCandidateListStore';
import type { GetArchivedCustomersListResponse } from '../types';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

import qs from 'qs';

export default function useArchivedCandidateList() {
  const {
    tableData,
    filterData,
    setTableData,
    selectedArchivedCandidate,
    setSelectedArchivedCandidate,
    setSelectAllArchivedCandidate,
    setFilterData,
  } = useArchivedCandidateListStore((state) => state);

  const { recruiter } = useUserContext();
  console.log('useArchivedCandidateList', recruiter);

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
    {}
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
    companyId: recruiter?.companyId,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/company-archived-applicant?${queryString}`,
    (url) =>
      apiService.get<GetArchivedCustomersListResponse>(
        `/company-archived-applicant?${queryString}`
      ),
    {
      revalidateOnFocus: false,
    }
  );

  const archivedCandidateList = data?.list || [];

  const archivedCandidateListTotal = data?.total || 0;

  return {
    archivedCandidateList,
    archivedCandidateListTotal,
    error,
    isLoading,
    tableData,
    filterData,
    mutate,
    setTableData,
    selectedArchivedCandidate,
    setSelectedArchivedCandidate,
    setSelectAllArchivedCandidate,
    setFilterData,
  };
}
