import {
  Applicant,
  Profession,
  ProfessionalData,
  User,
} from '@prisma/client';

type ProfessionalDataWithDescription = ProfessionalData & {
  profession: Profession;
};

export type Candidate = Applicant & {
  user: User;
  professionalData: ProfessionalDataWithDescription[];
};

export type GetCandidateListResponse = {
  list: Candidate[];
  total: number;
};

export type Filter = {
  profession: Array<number>;
};
