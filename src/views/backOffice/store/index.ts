import { create } from 'zustand';
import type { TableQueries } from '@/@types/common';
import { Filter } from '../../../types/pagination';
import { getInitialState } from './initialState';
import {
  AcademicDataStatus,
  AcademicLevel,
  City,
  Company,
  ContractType,
  Country,
  DocumentType,
  DriverLicense,
  EmploymentSector,
  EmploymentStatus,
  Gender,
  GenderPreference,
  JobHierarchy,
  Language,
  MaritalStatus,
  OtherSkills,
  Permission,
  Profession,
  Role,
  SalaryRange,
  SkillLevel,
  SoftwareSkills,
  State,
  User,
  WorkShift,
} from '@prisma/client';

export const initialFilterData = {};

export type ListState<T> = {
  tableData: TableQueries;
  filterData: Filter;
  orderList: T[];
};

type ListActions = {
  setFilterData: (payload: Filter) => void;
  setTableData: (payload: TableQueries) => void;
};

export const useUserListStore = create<ListState<User> & ListActions>(
  (set) => ({
    ...getInitialState<User>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useCompanyListStore = create<ListState<Company> & ListActions>(
  (set) => ({
    ...getInitialState<Company>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useRoleListStore = create<ListState<Role> & ListActions>(
  (set) => ({
    ...getInitialState<Role>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const usePermissionListStore = create<
  ListState<Permission> & ListActions
>((set) => ({
  ...getInitialState<Permission>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useDocumentTypeListStore = create<
  ListState<DocumentType> & ListActions
>((set) => ({
  ...getInitialState<DocumentType>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useGenderListStore = create<ListState<Gender> & ListActions>(
  (set) => ({
    ...getInitialState<Gender>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useMaritalStatusListStore = create<
  ListState<MaritalStatus> & ListActions
>((set) => ({
  ...getInitialState<MaritalStatus>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useCountryListStore = create<ListState<Country> & ListActions>(
  (set) => ({
    ...getInitialState<Country>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useStateListStore = create<ListState<State> & ListActions>(
  (set) => ({
    ...getInitialState<State>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useCityListStore = create<ListState<City> & ListActions>(
  (set) => ({
    ...getInitialState<City>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useDriverLicenseTypeListStore = create<
  ListState<DriverLicense> & ListActions
>((set) => ({
  ...getInitialState<DriverLicense>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useAcademicLevelListStore = create<
  ListState<AcademicLevel> & ListActions
>((set) => ({
  ...getInitialState<AcademicLevel>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useProfessionListStore = create<
  ListState<Profession> & ListActions
>((set) => ({
  ...getInitialState<Profession>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useJobHierarchyListStore = create<
  ListState<JobHierarchy> & ListActions
>((set) => ({
  ...getInitialState<JobHierarchy>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useContractTypeListStore = create<
  ListState<ContractType> & ListActions
>((set) => ({
  ...getInitialState<ContractType>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useEmploymentStatusListStore = create<
  ListState<EmploymentStatus> & ListActions
>((set) => ({
  ...getInitialState<EmploymentStatus>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useEmploymentSectorListStore = create<
  ListState<EmploymentSector> & ListActions
>((set) => ({
  ...getInitialState<EmploymentSector>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useSalaryRangeListStore = create<
  ListState<SalaryRange> & ListActions
>((set) => ({
  ...getInitialState<SalaryRange>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useWorkShiftListStore = create<ListState<WorkShift> & ListActions>(
  (set) => ({
    ...getInitialState<WorkShift>(),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
  })
);

export const useGenderPreferenceListStore = create<
  ListState<GenderPreference> & ListActions
>((set) => ({
  ...getInitialState<GenderPreference>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useSoftwareSkillListStore = create<
  ListState<SoftwareSkills> & ListActions
>((set) => ({
  ...getInitialState<SoftwareSkills>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useLanguageSkillListStore = create<
  ListState<Language> & ListActions
>((set) => ({
  ...getInitialState<Language>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useSkillLevelListStore = create<
  ListState<SkillLevel> & ListActions
>((set) => ({
  ...getInitialState<SkillLevel>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useOtherSkillListStore = create<
  ListState<OtherSkills> & ListActions
>((set) => ({
  ...getInitialState<OtherSkills>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));

export const useAcademicHistoryStatusListStore = create<
  ListState<AcademicDataStatus> & ListActions
>((set) => ({
  ...getInitialState<AcademicDataStatus>(),
  setFilterData: (payload) => set(() => ({ filterData: payload })),
  setTableData: (payload) => set(() => ({ tableData: payload })),
}));
