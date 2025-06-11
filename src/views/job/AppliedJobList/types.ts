import { Applicant, Company, JobApplicant, JobHierarchy, JobOffer } from '@prisma/client';

export type JobOfferApplicant = JobApplicant & {
  applicant: Applicant;
  job: JobOffer & {company: Company; job_hierarchy: JobHierarchy };

};

export type JobOfferApplicants = JobOfferApplicant[];

export type Filter = {
  [key: string]: unknown;
};

export type GetJobApplicantResponse = {
  list: JobOfferApplicants;
  total: number;
};

export type GetJobApplicationsResponse = {
  list: Array<JobApplicant & { applicant: Applicant; job: JobOffer }>;
  total: number;
};
