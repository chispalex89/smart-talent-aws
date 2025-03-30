import { Company, User, Recruiter } from '@prisma/client';

export type CompanyWithUsers = Company & {
  recruiters: Array<Recruiter & { user: User }>;
}