import useSWR from 'swr';
import qs from 'qs';
import {
  useUserListStore,
  useCompanyListStore,
  useRoleListStore,
  usePermissionListStore,
  useDocumentTypeListStore,
  useGenderListStore,
  useMaritalStatusListStore,
  useCountryListStore,
  useCityListStore,
  useDriverLicenseTypeListStore,
  useAcademicLevelListStore,
  useProfessionListStore,
  useJobHierarchyListStore,
  useEmploymentStatusListStore,
  useEmploymentSectorListStore,
  useSalaryRangeListStore,
  useWorkShiftListStore,
  useGenderPreferenceListStore,
  useSoftwareSkillListStore,
  useLanguageSkillListStore,
  useSkillLevelListStore,
  useOtherSkillListStore,
  useAcademicHistoryStatusListStore,
  useStateListStore,
  useContractTypeListStore,
} from '../store';
import type { Filter, Pagination } from '../../../types/pagination';
import type { TableQueries } from '@/@types/common';
import { User } from '@prisma/client';
import { getInitialState } from '../store/initialState';
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

export function useDocumentTypeList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useDocumentTypeListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'document-type'
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

export function useGenderList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useGenderListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'gender'
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

export function useMaritalStatusList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useMaritalStatusListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'marital-status'
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

export function useCountryList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useCountryListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'country'
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

export function useStateList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useStateListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'state'
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

export function useCityList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useCityListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'city'
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

export function useDriverLicenseTypeList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useDriverLicenseTypeListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'driver-license'
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

export function useAcademicLevelList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useAcademicLevelListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'academic-level'
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

export function useAcademicHistoryStatusList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useAcademicHistoryStatusListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'academic-status'
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

export function useProfessionList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useProfessionListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'profession'
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

export function useJobHierarchyList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useJobHierarchyListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'job-hierarchy'
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

export function useEmploymentSectorList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useEmploymentSectorListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'employment-sector'
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

export function useEmploymentStatusList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useEmploymentStatusListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'employment-status'
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

export function useSalaryRangeList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useSalaryRangeListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'salary-range'
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

export function useWorkShiftList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useWorkShiftListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'working-shift'
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

export function useContractTypeList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useContractTypeListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'contract-type'
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

export function useSoftwareSkillList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useSoftwareSkillListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'software-skill'
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

export function useLanguageSkillList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useLanguageSkillListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'language'
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

export function useSkillLevelList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useSkillLevelListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'skill-level'
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

export function useOtherSkillList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useOtherSkillListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'other-skills'
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

export function useGenderPreferenceList() {
  const { tableData, filterData, setTableData, setFilterData } =
    useGenderPreferenceListStore((state) => state);

  const { list, total, error, isLoading, mutate } = query(
    filterData,
    tableData,
    'gender-preferences'
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