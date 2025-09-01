import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { userMigration } from './functions/user-migration/resource';

export const backend =

defineBackend({
  auth,
  userMigration,
});

// Attach the function to the Cognito User Pool "User Migration" trigger
backend.auth.resources.cfnResources.cfnUserPool.lambdaConfig = {
  userMigration: backend.userMigration.resources.lambda.functionArn,
};

backend.auth.resources.cfnResources.cfnUserPoolClient.explicitAuthFlows = [
  'ALLOW_USER_PASSWORD_AUTH',
  'ALLOW_USER_SRP_AUTH',
  'ALLOW_REFRESH_TOKEN_AUTH',
];