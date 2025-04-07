import { Company, User, Recruiter, Membership, MembershipType } from '@prisma/client';

export type CompanyWithUsers = Company & {
  recruiters: Array<Recruiter & { user: User }>;
  Membership: Array<Membership & { membership_type: MembershipType }>;
}