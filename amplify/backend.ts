import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { userMigration } from './functions/user-migration/resource';

export const backend =

defineBackend({
  auth,
  userMigration,
});

backend.auth.resources.cfnResources.cfnUserPoolClient.explicitAuthFlows = [
  'ALLOW_USER_PASSWORD_AUTH',
  'ALLOW_USER_SRP_AUTH',
  'ALLOW_REFRESH_TOKEN_AUTH',
];