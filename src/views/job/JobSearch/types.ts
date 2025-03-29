import {
  AcademicLevel,
  Applicant,
  City,
  Company,
  ContractType,
  Country,
  EmploymentSector,
  GenderPreference,
  JobHierarchy,
  JobOffer,
  MaritalStatus,
  Profession,
  SalaryRange,
  State,
  WorkShift,
} from '@prisma/client';

export type Job = JobOffer & {
  jobApplicants: Applicant[];
  views: number;
  company: Company;
  city: City;
  Country: Country;
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
};

export type JobOffers = Job[];

export type Filter = {
  [key: string]: unknown;
};

export type GetJobOffersResponse = {
  list: JobOffers;
  total: number;
};
