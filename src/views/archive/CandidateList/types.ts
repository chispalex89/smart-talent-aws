import {
  Applicant,
  CompanyFavoriteApplicant,
  Profession,
  ProfessionalData,
  User,
} from '@prisma/client';

type ProfessionalDataWithDescription = ProfessionalData & {
  profession: Profession;
};

export type ArchivedCandidate = CompanyFavoriteApplicant & {
  applicant: Applicant & {
    user: User;
    professionalData: ProfessionalDataWithDescription[];
  };
};

export type GetArchivedCustomersListResponse = {
  list: ArchivedCandidate[];
  total: number;
};

export type Filter = {
  profession: Array<number>;
};
