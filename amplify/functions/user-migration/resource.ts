import { defineFunction, secret } from '@aws-amplify/backend';

export const userMigration = defineFunction({
  name: 'user-migration',
  entry: './handler.ts',
  timeoutSeconds: 10,
  memoryMB: 512,
  // Bind secrets/env you need to reach the legacy DB
  environment: {
    LEGACY_DB_URL: secret('LEGACY_DB_URL'),
    LEGACY_DB_USER: secret('LEGACY_DB_USER'),
    LEGACY_DB_PASS: secret('LEGACY_DB_PASS'),
  },
  logging: {
    level: 'info',
    format: 'json',
  },
  
});
