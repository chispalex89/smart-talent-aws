// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Recruiter, User, Applicant, JobApplicant, JobOffer } = initSchema(schema);

export {
  Recruiter,
  User,
  Applicant,
  JobApplicant,
  JobOffer
};