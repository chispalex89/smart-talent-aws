import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { userMigration } from './functions/user-migration/resource';

export const backend =

defineBackend({
  auth,
  data,
  userMigration,
});
