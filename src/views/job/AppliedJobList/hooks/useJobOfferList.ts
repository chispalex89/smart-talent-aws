import useSWR from 'swr';
import { useJobListStore } from '../store/jobOfferListStore';
import type { GetJobApplicantResponse } from '../types';
import qs from 'qs';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

export default function useJobOfferList() {
    const { applicant } = useUserContext();
  
  const { tableData, filterData, setTableData, setFilterData } =
    useJobListStore((state) => state);

  const filterDataWithoutEmptyValues = Object.entries(filterData).reduce((prev, curr) => {
    if (curr[1] !== '') {
      return { ...prev, [curr[0]]: curr[1] };
    }
    return prev;
  }, {});
  
  // Serialize the tableData and filterData into a query string
  const queryString = qs.stringify({
      sort: tableData.sort ? Object.keys(tableData.sort)[0] : undefined,
      order: tableData.sort ? tableData.sort[Object.keys(tableData.sort)[0]] : undefined,
      pageIndex: tableData.pageIndex,
      pageSize: tableData.pageSize,
      name: tableData.query ? tableData.query : undefined,
      
    ...filterDataWithoutEmptyValues,

    applicantId: applicant?.id,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/job-applicant?${queryString}`,
    (url) => apiService.get<GetJobApplicantResponse>(url),
    {
      revalidateOnFocus: false,
    },
  );

  const jobOfferList = data?.list || [];

  const jobOfferListTotal = data?.total || 0;

  return {
    jobOfferList,
    jobOfferListTotal,
    error,
    isLoading,
    tableData,
    filterData,
    mutate,
    setTableData,
    setFilterData,
  };
}
