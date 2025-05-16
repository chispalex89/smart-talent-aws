import {
  AcademicLevel,
  Applicant,
  City,
  Company,
  ContractType,
  Country,
  EmploymentSector,
  FavoriteJobOffer,
  GenderPreference,
  JobHierarchy,
  JobOffer,
  MaritalStatus,
  Profession,
  SalaryRange,
  State,
  WorkShift,
} from '@prisma/client';

export type JobOfferDetails = JobOffer & {
  jobApplicants: Array<Applicant>;
  company: Company;
  city: City;
  country: Country;
  employment_sector: EmploymentSector;
  gender_preference: GenderPreference;
  job_hierarchy: JobHierarchy;
  marital_status: MaritalStatus;
  minimum_academic_level: AcademicLevel;
  profession: Profession;
  salary_range: SalaryRange;
  state: State;
  work_shift: WorkShift;
  contract_type: ContractType;
  FavoriteJobOffer: Array<FavoriteJobOffer>;
};
