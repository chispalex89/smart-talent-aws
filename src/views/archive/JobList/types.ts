import { Applicant, JobOffer } from '@prisma/client';

export type Job = JobOffer & {
    jobApplicants: Applicant[];
    views: number;
};

export type JobOffers = Job[];

export type Filter = {
  [key: string]: unknown;
};

export type GetJobOffersResponse = {
  list: JobOffers;
  total: number;
};
