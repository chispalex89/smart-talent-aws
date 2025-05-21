import {
  AcademicData,
  Applicant,
  FavoriteJobOffer,
  JobApplicant,
  JobExperienceData,
  JobPreferences,
  LanguageSkillsData,
  OtherSkillsData,
  PersonalData,
  SoftwareSkillsData,
  User,
} from '@prisma/client';

export type UserApplicant = User & {
  applicant: Applicant & {
    jobApplicants: Array<JobApplicant>;
    professionalData: Array<PersonalData>;
    jobExperienceData: Array<JobExperienceData>;
    personalData: Array<PersonalData>;
    jobPreferences: Array<JobPreferences>;
    favoriteJobOffer: Array<FavoriteJobOffer>;
    otherSkillsData: Array<OtherSkillsData>;
    academicData: Array<AcademicData>;
    languageSkillsData: Array<LanguageSkillsData>;
    softwareSkillsData: Array<SoftwareSkillsData>;
  };
};
