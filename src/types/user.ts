import {
  AcademicData,
  City,
  DocumentType,
  DriverLicense,
  FavoriteJobOffer,
  Gender,
  JobApplicant,
  JobExperienceData,
  JobPreferences,
  Language,
  LanguageSkillsData,
  MaritalStatus,
  OtherSkillsData,
  PersonalData,
  ProfessionalData,
  SkillLevel,
  SoftwareSkills,
  SoftwareSkillsData,
  User,
} from '@prisma/client';

export type ApplicantPersonalData = PersonalData & {
  marital_status: MaritalStatus;
  city: City;
  document_type: DocumentType;
  driver_license: DriverLicense;
  gender: Gender;
};

export type LanguageSkill = LanguageSkillsData & {
  language: Language;
  skillLevel: SkillLevel;
};

export type SoftwareSkill = SoftwareSkillsData & {
  software: SoftwareSkills;
  skillLevel: SkillLevel;
};

export type UserApplicant = User & {
  jobApplicants: Array<JobApplicant>;
  jobExperienceData: Array<JobExperienceData>;
  jobPreferences: Array<JobPreferences>;
  favoriteJobOffer: Array<FavoriteJobOffer>;
  otherSkillsData: Array<OtherSkillsData>;
  academicData: Array<AcademicData>;
  languageSkillsData: Array<LanguageSkill>;
  softwareSkillsData: Array<SoftwareSkill>;
  professionalData: Array<ProfessionalData>;
  personalData: Array<ApplicantPersonalData>;
};
