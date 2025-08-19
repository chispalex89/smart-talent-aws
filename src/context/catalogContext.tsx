import {
  AcademicLevel,
  City,
  ContractType,
  Country,
  DocumentType,
  DriverLicense,
  EmploymentSector,
  EmploymentStatus,
  Gender,
  JobHierarchy,
  MaritalStatus,
  Profession,
  SalaryRange,
  WorkShift,
  Language,
  SkillLevel,
  SoftwareSkills,
  State,
  MembershipType,
  GenderPreference,
  OtherSkills,
  AcademicDataStatus,
  HiringEmploymentSector,
} from '@prisma/client';
import React, { FC, useEffect } from 'react';
import apiService from '../services/apiService';

export interface ICatalogContext {
  academicLevels: AcademicLevel[];
  academicStatuses: AcademicDataStatus[];
  cities: City[];
  contractTypes: ContractType[];
  countries: Country[];
  documentTypes: DocumentType[];
  driverLicenseTypes: DriverLicense[];
  employmentStatuses: EmploymentStatus[];
  employmentSectors: EmploymentSector[];
  hiringEmploymentSectors: HiringEmploymentSector[];
  jobHierarchies: JobHierarchy[];
  genders: Gender[];
  genderPreferences: GenderPreference[];
  languages: Language[];
  maritalStatuses: MaritalStatus[];
  professions: Profession[];
  salaryRanges: SalaryRange[];
  skillLevels: SkillLevel[];
  softwareSkills: SoftwareSkills[];
  otherSkills: OtherSkills[];
  states: State[];
  workShifts: WorkShift[];
  membershipTypes: MembershipType[];
}

export const CatalogContext = React.createContext<ICatalogContext | null>(null);

export const CatalogContextProvider: FC<{
  children: React.ReactNode | React.ReactNode[] | null;
}> = (props) => {
  const [academicLevels, setAcademicLevels] = React.useState<AcademicLevel[]>(
    [],
  );
  const [academicStatuses, setAcademicStatuses] = React.useState<AcademicDataStatus[]>(
    []
  );
  const [cities, setCities] = React.useState<City[]>([]);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [contractTypes, setContractTypes] = React.useState<ContractType[]>([]);
  const [documentTypes, setDocumentTypes] = React.useState<DocumentType[]>([]);
  const [driverLicenseTypes, setDriverLicenseTypes] = React.useState<
    DriverLicense[]
  >([]);
  const [employmentSectors, setEmploymentSectors] = React.useState<
    EmploymentSector[]
  >([]);
  const [hiringEmploymentSectors, setHiringEmploymentSectors] = React.useState<
    HiringEmploymentSector[]
  >([]);
  const [employmentStatuses, setEmploymentStatuses] = React.useState<
    EmploymentStatus[]
  >([]);
  const [genders, setGenders] = React.useState<Gender[]>([]);
  const [genderPreferences, setGenderPreferences] = React.useState<
    GenderPreference[]
  >([]);
  const [jobHierarchies, setJobHierarchies] = React.useState<JobHierarchy[]>(
    [],
  );
  const [languages, setLanguages] = React.useState<Language[]>([]);
  const [maritalStatuses, setMaritalStatuses] = React.useState<MaritalStatus[]>(
    [],
  );
  const [professions, setProfessions] = React.useState<Profession[]>([]);
  const [salaryRanges, setSalaryRanges] = React.useState<SalaryRange[]>([]);
  const [skillLevels, setSkillLevels] = React.useState<SkillLevel[]>([]);
  const [softwareSkills, setSoftwareSkills] = React.useState<SoftwareSkills[]>(
    [],
  );
  const [states, setStates] = React.useState<State[]>([]);
  const [workShifts, setWorkShifts] = React.useState<WorkShift[]>([]);
  const [membershipTypes, setMembershipTypes] = React.useState<
    MembershipType[]
  >([]);
  const [otherSkills, setOtherSkills] = React.useState<OtherSkills[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    async function fetchAcademicLevels() {
      const data = await apiService.get<AcademicLevel[]>('/academic-level');
      setAcademicLevels(data);
    }

    async function fetchAcademicStatuses() {
      const data = await apiService.get<AcademicDataStatus[]>('/academic-status');
      setAcademicStatuses(data);
    }

    async function fetchCities() {
      const data = await apiService.get<City[]>('/city');
      setCities(data);
    }

    async function fetchCountries() {
      const data = await apiService.get<Country[]>('/country');
      setCountries(data);
    }

    async function fetchContractTypes() {
      const data = await apiService.get<ContractType[]>('/contract-type');
      setContractTypes(data);
    }

    async function fetchDocumentTypes() {
      const data = await apiService.get<DocumentType[]>('/document-type');
      setDocumentTypes(data);
    }

    async function fetchDriverLicenseTypes() {
      const data = await apiService.get<DriverLicense[]>('/driver-license');
      setDriverLicenseTypes(data);
    }

    async function fetchEmploymentSectors() {
      const data =
        await apiService.get<EmploymentSector[]>('/employment-sector');
      setEmploymentSectors(data);
    }

    async function fetchEmploymentStatuses() {
      const data =
        await apiService.get<EmploymentStatus[]>('/employment-status');
      setEmploymentStatuses(data);
    }

    async function fetchGenders() {
      const data = await apiService.get<Gender[]>('/gender');
      setGenders(data);
    }

    async function fetchGenderPreferences() {
      const data = await apiService.get<GenderPreference[]>(
        '/gender-preferences',
      );
      setGenderPreferences(data);
    }

    async function fetchHiringEmploymentSectors() {
      const data = await apiService.get<HiringEmploymentSector[]>(
        '/hiring-employment-sector',
      );
      setHiringEmploymentSectors(data);
    }

    async function fetchJobHierarchies() {
      const data = await apiService.get<JobHierarchy[]>('/job-hierarchy');
      setJobHierarchies(data);
    }

    async function fetchLanguages() {
      const data = await apiService.get<Language[]>('/language');
      setLanguages(data);
    }

    async function fetchMaritalStatuses() {
      const data = await apiService.get<MaritalStatus[]>('/marital-status');
      setMaritalStatuses(data);
    }

    async function fetchProfessions() {
      const data = await apiService.get<Profession[]>('/profession');
      setProfessions(data);
    }

    async function fetchSalaryRanges() {
      const data = await apiService.get<SalaryRange[]>('/salary-range');
      setSalaryRanges(data);
    }

    async function fetchSkillLevels() {
      const data = await apiService.get<SkillLevel[]>('/skill-level');
      setSkillLevels(data);
    }

    async function fetchSoftwareSkills() {
      const data = await apiService.get<SoftwareSkills[]>('/software-skill');
      setSoftwareSkills(data);
    }

    async function fetchStates() {
      const data = await apiService.get<State[]>('/state');
      setStates(data);
    }

    async function fetchWorkShifts() {
      const data = await apiService.get<WorkShift[]>('/working-shift');
      setWorkShifts(data);
    }

    async function fetchMembershipTypes() {
      const data = await apiService.get<MembershipType[]>('/membership-type');
      setMembershipTypes(data);
    }

    async function fetchOtherSkills() {
      const data = await apiService.get<OtherSkills[]>('/other-skills');
      setOtherSkills(data);
    }

    if (!loaded) {
      fetchAcademicLevels();
      fetchAcademicStatuses();
      fetchCities();
      fetchCountries();
      fetchContractTypes();
      fetchDocumentTypes();
      fetchDriverLicenseTypes();
      fetchEmploymentSectors();
      fetchEmploymentStatuses();
      fetchGenders();
      fetchGenderPreferences();
      fetchHiringEmploymentSectors();
      fetchJobHierarchies();
      fetchLanguages();
      fetchMaritalStatuses();
      fetchProfessions();
      fetchSalaryRanges();
      fetchSkillLevels();
      fetchSoftwareSkills();
      fetchStates();
      fetchWorkShifts();
      fetchMembershipTypes();
      fetchOtherSkills();
      setLoaded(true);
    }
  }, [setLoaded]);

  return (
    <CatalogContext.Provider
      value={{
        academicLevels,
        academicStatuses,
        cities,
        contractTypes,
        countries,
        documentTypes,
        driverLicenseTypes,
        employmentSectors,
        employmentStatuses,
        genders,
        genderPreferences,
        hiringEmploymentSectors,
        jobHierarchies,
        languages,
        maritalStatuses,
        professions,
        salaryRanges,
        states,
        skillLevels,
        softwareSkills,
        workShifts,
        otherSkills,
        membershipTypes: membershipTypes ?? [],
      }}
    >
      {props.children}
    </CatalogContext.Provider>
  );
};

export function useCatalogContext() {
  const context = React.useContext(CatalogContext);
  if (!context) {
    throw new Error(
      'useCatalogContext must be used within a CatalogContextProvider',
    );
  }
  return context;
}
