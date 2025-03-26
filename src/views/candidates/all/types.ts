import {
  Applicant,
  City,
  Country,
  Gender,
  PersonalData,
  Profession,
  ProfessionalData,
  State,
  User,
} from '@prisma/client';

type ProfessionalDataWithDescription = ProfessionalData & {
  profession: Profession;
};

type StateWithCountry = State & {
  country: Country
}

type CityWithState = City & {
  state: StateWithCountry
}

type PersonalDataWithRelationships = PersonalData & {
  gender: Gender;
  city: CityWithState;
};

/**user: Prisma.$UserPayload<ExtArgs>
      companyFavoriteApplicants: Prisma.$CompanyFavoriteApplicantPayload<ExtArgs>[]
      jobApplicants: Prisma.$JobApplicantPayload<ExtArgs>[]
      professionalData: Prisma.$ProfessionalDataPayload<ExtArgs>[]
      jobExperienceData: Prisma.$JobExperienceDataPayload<ExtArgs>[]
      personalData: Prisma.$PersonalDataPayload<ExtArgs>[]
      jobPreferences: Prisma.$JobPreferencesPayload<ExtArgs>[]
      favoriteJobOffer: Prisma.$FavoriteJobOfferPayload<ExtArgs>[]
      otherSkillsData: Prisma.$OtherSkillsDataPayload<ExtArgs>[]
      academicData: Prisma.$AcademicDataPayload<ExtArgs>[]
      languageSkillsData: Prisma.$LanguageSkillsDataPayload<ExtArgs>[]
      softwareSkillsData: Prisma.$SoftwareSkillsDataPayload<ExtArgs>[] */

export type Candidate = Applicant & {
  user: User;
  professionalData: ProfessionalDataWithDescription[];
  personalData: PersonalDataWithRelationships[];
};

export type GetCandidateListResponse = {
  list: Candidate[];
  total: number;
};

export type Filter = {
  profession: Array<number>;
};
