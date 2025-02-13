import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerRecruiter = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Recruiter, 'id'>;
  };
  readonly id: string;
  readonly status: string;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt?: string | null;
  readonly updatedBy?: string | null;
  readonly User?: User | null;
  readonly recruiterUserId?: string | null;
}

type LazyRecruiter = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Recruiter, 'id'>;
  };
  readonly id: string;
  readonly status: string;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt?: string | null;
  readonly updatedBy?: string | null;
  readonly User: AsyncItem<User | undefined>;
  readonly recruiterUserId?: string | null;
}

export declare type Recruiter = LazyLoading extends LazyLoadingDisabled ? EagerRecruiter : LazyRecruiter

export declare const Recruiter: (new (init: ModelInit<Recruiter>) => Recruiter) & {
  copyOf(source: Recruiter, mutator: (draft: MutableModel<Recruiter>) => MutableModel<Recruiter> | void): Recruiter;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
  };
  readonly id: string;
  readonly firstName: string;
  readonly middleName?: string | null;
  readonly lastName: string;
  readonly secondLastName?: string | null;
  readonly marriedLastName?: string | null;
  readonly email: string;
  readonly status: string;
  readonly password?: string | null;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
  readonly createdBy: string;
  readonly updatedBy?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
  };
  readonly id: string;
  readonly firstName: string;
  readonly middleName?: string | null;
  readonly lastName: string;
  readonly secondLastName?: string | null;
  readonly marriedLastName?: string | null;
  readonly email: string;
  readonly status: string;
  readonly password?: string | null;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
  readonly createdBy: string;
  readonly updatedBy?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerApplicant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Applicant, 'id'>;
  };
  readonly id: string;
  readonly JobApplicants?: (JobApplicant | null)[] | null;
  readonly User?: User | null;
  readonly isDeleted: boolean;
  readonly status: string;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly applicantUserId?: string | null;
}

type LazyApplicant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Applicant, 'id'>;
  };
  readonly id: string;
  readonly JobApplicants: AsyncCollection<JobApplicant>;
  readonly User: AsyncItem<User | undefined>;
  readonly isDeleted: boolean;
  readonly status: string;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly applicantUserId?: string | null;
}

export declare type Applicant = LazyLoading extends LazyLoadingDisabled ? EagerApplicant : LazyApplicant

export declare const Applicant: (new (init: ModelInit<Applicant>) => Applicant) & {
  copyOf(source: Applicant, mutator: (draft: MutableModel<Applicant>) => MutableModel<Applicant> | void): Applicant;
}

type EagerJobApplicant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<JobApplicant, 'id'>;
  };
  readonly id: string;
  readonly appliedAt: string;
  readonly selected?: boolean | null;
  readonly selectedAt?: string | null;
  readonly reviewed?: boolean | null;
  readonly reviewedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicantID: string;
  readonly jobofferID: string;
}

type LazyJobApplicant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<JobApplicant, 'id'>;
  };
  readonly id: string;
  readonly appliedAt: string;
  readonly selected?: boolean | null;
  readonly selectedAt?: string | null;
  readonly reviewed?: boolean | null;
  readonly reviewedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicantID: string;
  readonly jobofferID: string;
}

export declare type JobApplicant = LazyLoading extends LazyLoadingDisabled ? EagerJobApplicant : LazyJobApplicant

export declare const JobApplicant: (new (init: ModelInit<JobApplicant>) => JobApplicant) & {
  copyOf(source: JobApplicant, mutator: (draft: MutableModel<JobApplicant>) => MutableModel<JobApplicant> | void): JobApplicant;
}

type EagerJobOffer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<JobOffer, 'id'>;
  };
  readonly id: string;
  readonly uuid: string;
  readonly name: string;
  readonly ageRangeFrom: number;
  readonly ageRangeTo: number;
  readonly description: string;
  readonly publicDescription?: string | null;
  readonly isExperienceRequired: boolean;
  readonly requiredExperience?: number | null;
  readonly softwareSkills?: string | null;
  readonly mainLanguageId?: string | null;
  readonly languageSkills?: string | null;
  readonly otherLanguages?: (string | null)[] | null;
  readonly isConfidential: boolean;
  readonly featured: boolean;
  readonly requiredAvailabilityToTravel: boolean;
  readonly requiredDriverLicense: boolean;
  readonly expectedDriverLicense?: string | null;
  readonly schedule: string;
  readonly vacancies: number;
  readonly hiringDate: string;
  readonly publicationDate: string;
  readonly receivesResumesByEmail: boolean;
  readonly status: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly isDeleted?: boolean | null;
  readonly JobApplicants?: (JobApplicant | null)[] | null;
}

type LazyJobOffer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<JobOffer, 'id'>;
  };
  readonly id: string;
  readonly uuid: string;
  readonly name: string;
  readonly ageRangeFrom: number;
  readonly ageRangeTo: number;
  readonly description: string;
  readonly publicDescription?: string | null;
  readonly isExperienceRequired: boolean;
  readonly requiredExperience?: number | null;
  readonly softwareSkills?: string | null;
  readonly mainLanguageId?: string | null;
  readonly languageSkills?: string | null;
  readonly otherLanguages?: (string | null)[] | null;
  readonly isConfidential: boolean;
  readonly featured: boolean;
  readonly requiredAvailabilityToTravel: boolean;
  readonly requiredDriverLicense: boolean;
  readonly expectedDriverLicense?: string | null;
  readonly schedule: string;
  readonly vacancies: number;
  readonly hiringDate: string;
  readonly publicationDate: string;
  readonly receivesResumesByEmail: boolean;
  readonly status: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly isDeleted?: boolean | null;
  readonly JobApplicants: AsyncCollection<JobApplicant>;
}

export declare type JobOffer = LazyLoading extends LazyLoadingDisabled ? EagerJobOffer : LazyJobOffer

export declare const JobOffer: (new (init: ModelInit<JobOffer>) => JobOffer) & {
  copyOf(source: JobOffer, mutator: (draft: MutableModel<JobOffer>) => MutableModel<JobOffer> | void): JobOffer;
}