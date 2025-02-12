import { Applicant, CompanyFavoriteApplicant, Profession, ProfessionalData, User } from '@prisma/client';

type ProfessionalDataWithDescription = ProfessionalData & { profession: Profession};

export type FavoriteCandidate = CompanyFavoriteApplicant & {
  applicant: Applicant & {
    user: User;
    professionalData: ProfessionalDataWithDescription[];
  };
};

export type GetFavoriteCustomersListResponse = {
  list: FavoriteCandidate[];
  total: number;
};

export type Filter = {
  profession: Array<number>;
};
